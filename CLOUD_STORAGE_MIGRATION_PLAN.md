# Cloud Storage Migration Plan for Junglore KE

## 🎯 **Objective**
Migrate from local file storage to cloud storage (Cloudflare R2) to solve Railway's ephemeral storage problem.

## 📋 **Current State Analysis**

### **Frontend (Vite.js on Vercel)**
- Media Service: `src/services/mediaService.js`
- Upload handling: FormData with multipart uploads
- Image URLs: Built using `_buildFullImageUrl()` method
- Current upload endpoint: `/api/v1/media/upload`

### **Backend (FastAPI on Railway)**
- Media endpoint: `app/api/endpoints/media.py`
- Upload directory: Local `uploads/` folder ❌
- File handling: Direct filesystem writes
- Media types: Images, videos, audio, podcasts

### **Database**
- Media table: File paths stored as relative paths
- URL construction: Frontend builds full URLs from relative paths

## 🔧 **Migration Strategy: Cloudflare R2**

### **Why Cloudflare R2?**
✅ S3-compatible API (easy integration)
✅ Zero egress fees (cost savings)
✅ Global CDN included
✅ Image transformations available
✅ Better performance than S3

### **Phase 1: Backend Changes**

#### **1.1 Install Dependencies**
```bash
pip install boto3 python-dotenv
```

#### **1.2 Environment Variables**
```env
# Cloudflare R2 Configuration
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=junglore-media
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-domain.r2.dev
```

#### **1.3 Create Storage Service**
Create `app/services/cloud_storage.py`:
```python
import boto3
from botocore.exceptions import ClientError
import os
from pathlib import Path
import uuid
import mimetypes

class CloudStorageService:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            endpoint_url=os.getenv('R2_ENDPOINT_URL'),
            aws_access_key_id=os.getenv('R2_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('R2_SECRET_ACCESS_KEY'),
            region_name='auto'
        )
        self.bucket_name = os.getenv('R2_BUCKET_NAME')
        self.public_url = os.getenv('R2_PUBLIC_URL')
    
    async def upload_file(self, file_content: bytes, filename: str, content_type: str) -> str:
        """Upload file to R2 and return public URL"""
        # Generate unique filename
        file_ext = Path(filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        
        # Determine folder based on content type
        folder = self._get_folder_by_type(content_type)
        object_key = f"{folder}/{unique_filename}"
        
        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=object_key,
                Body=file_content,
                ContentType=content_type,
                ACL='public-read'
            )
            
            return f"{self.public_url}/{object_key}"
        except ClientError as e:
            raise Exception(f"Failed to upload file: {e}")
    
    def _get_folder_by_type(self, content_type: str) -> str:
        if content_type.startswith('image/'):
            return 'images'
        elif content_type.startswith('video/'):
            return 'videos'
        elif content_type.startswith('audio/'):
            return 'audio'
        else:
            return 'documents'
```

#### **1.4 Update Media Endpoint**
Modify `app/api/endpoints/media.py`:
```python
from app.services.cloud_storage import CloudStorageService

storage_service = CloudStorageService()

@router.post("/upload", response_model=MediaUploadResponse)
async def upload_media(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    photographer: Optional[str] = Form(None),
    national_park: Optional[str] = Form(None),
    content_id: Optional[UUID] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Read file content
    file_content = await file.read()
    
    # Upload to R2
    public_url = await storage_service.upload_file(
        file_content, 
        file.filename, 
        file.content_type
    )
    
    # Save to database
    media_data = {
        "title": title or file.filename,
        "description": description,
        "file_url": public_url,  # Store full R2 URL
        "media_type": get_media_type_from_mimetype(file.content_type),
        "file_size": len(file_content),
        "photographer": photographer,
        "national_park": national_park,
        "content_id": content_id
    }
    
    db_media = Media(**media_data)
    db.add(db_media)
    await db.commit()
    
    return MediaUploadResponse(
        id=db_media.id,
        file_url=public_url,
        message="File uploaded successfully"
    )
```

### **Phase 2: Frontend Changes (Minimal)**

#### **2.1 Update Media Service**
Modify `src/services/mediaService.js`:
```javascript
_buildFullImageUrl(relativeUrl) {
    if (!relativeUrl) return null;

    // If it's already a full URL (from R2), return as is
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
        return relativeUrl;
    }

    // Legacy support for old relative URLs
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    const backendUrl = apiUrl.replace('/api/v1', '');
    return `${backendUrl}/${relativeUrl}`;
}
```

### **Phase 3: Data Migration**

#### **3.1 Migration Script**
Create `migrate_to_cloud_storage.py`:
```python
import asyncio
import os
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.models.media import Media
from app.services.cloud_storage import CloudStorageService

async def migrate_existing_files():
    """Migrate existing local files to R2"""
    storage_service = CloudStorageService()
    
    # Get all media records
    async with AsyncSession(engine) as db:
        result = await db.execute(select(Media))
        media_files = result.scalars().all()
        
        for media in media_files:
            if media.file_url.startswith('http'):
                continue  # Already migrated
            
            # Read local file
            local_path = Path(f"uploads/{media.file_url}")
            if not local_path.exists():
                print(f"File not found: {local_path}")
                continue
            
            with open(local_path, 'rb') as f:
                file_content = f.read()
            
            # Upload to R2
            try:
                public_url = await storage_service.upload_file(
                    file_content,
                    local_path.name,
                    mimetypes.guess_type(str(local_path))[0]
                )
                
                # Update database
                media.file_url = public_url
                await db.commit()
                
                print(f"Migrated: {local_path} -> {public_url}")
            except Exception as e:
                print(f"Failed to migrate {local_path}: {e}")

if __name__ == "__main__":
    asyncio.run(migrate_existing_files())
```

### **Phase 4: Environment Setup**

#### **4.1 Cloudflare R2 Setup**
1. Create Cloudflare account
2. Go to R2 Object Storage
3. Create bucket: `junglore-media`
4. Create API token with R2:Edit permissions
5. Set up custom domain (optional): `media.junglore.com`

#### **4.2 Railway Environment Variables**
Add to Railway:
```
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=junglore-media
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://media.junglore.com
```

### **Phase 5: Testing & Deployment**

#### **5.1 Testing Plan**
1. Test file upload through admin panel
2. Verify images display in frontend
3. Test podcast playback
4. Check video streaming
5. Validate file URLs in database

#### **5.2 Rollback Plan**
- Keep local upload code as fallback
- Environment variable to switch between local/cloud
- Database backup before migration

## 📊 **Cost Estimation**

### **Cloudflare R2 Pricing**
- Storage: $0.015/GB/month
- Operations: $4.50/million writes, $0.36/million reads
- **Zero egress fees** (huge savings!)

### **Estimated Monthly Costs**
- 10GB media: $0.15/month
- 100GB media: $1.50/month
- 1TB media: $15/month

Compare to S3: Would cost 3-5x more with egress fees!

## ⚡ **Performance Benefits**

1. **Global CDN**: Faster media loading worldwide
2. **Image Optimization**: Automatic format conversion
3. **Scalability**: No storage limits
4. **Reliability**: 99.9% uptime SLA
5. **Bandwidth**: Unlimited egress

## 🔒 **Security Features**

1. **Access Control**: IAM policies
2. **HTTPS**: All transfers encrypted
3. **CORS**: Proper cross-origin setup
4. **Token-based**: Secure API access

## 📅 **Implementation Timeline**

- **Week 1**: Set up R2 bucket and credentials
- **Week 2**: Implement backend storage service
- **Week 3**: Update upload endpoints
- **Week 4**: Test and migrate existing files
- **Week 5**: Deploy and monitor

## ✅ **Success Criteria**

1. All new uploads go to R2
2. Existing media still accessible
3. Frontend displays images correctly
4. Podcast/video streaming works
5. Admin panel upload functions
6. Database URLs updated
7. Cost savings achieved

---

This migration will solve your Railway storage problem and provide a scalable, cost-effective media solution for production!