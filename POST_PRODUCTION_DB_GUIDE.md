# 🚀 Post-Production Database Management Guide

## Overview

This guide covers essential database management tasks after deploying your Junglore KE platform to production. It includes maintenance procedures, troubleshooting, and best practices for managing your PostgreSQL database on Railway.

## 📋 Table of Contents

1. [Database Health Checks](#database-health-checks)
2. [Backup and Recovery](#backup-and-recovery)
3. [Performance Monitoring](#performance-monitoring)
4. [Data Management](#data-management)
5. [Schema Updates](#schema-updates)
6. [Security and Access Control](#security-and-access-control)
7. [Troubleshooting](#troubleshooting)
8. [Emergency Procedures](#emergency-procedures)

---

## 🔍 Database Health Checks

### Daily Health Checks

```bash
# Check database connectivity
railway run python -c "import asyncio; from app.db.database import get_db_session; asyncio.run(check_db_connection())"

# Verify critical tables exist
railway run psql -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"

# Check user count and recent activity
railway run psql -c "SELECT COUNT(*) as total_users FROM users WHERE is_active = true;"

# Verify rewards system is working
railway run psql -c "SELECT COUNT(*) as total_rewards FROM rewards_configuration WHERE is_active = true;"
```

### Schema Synchronization Tools

**Available Scripts:**

1. **`compare_schemas.py`** - Comprehensive schema comparison
   - Compares all tables, columns, indexes, and constraints
   - Provides detailed difference reports
   - Safe to run anytime

2. **`sync_schemas.py`** - Automated migration generation
   - Detects missing columns in production
   - Generates Alembic migration files automatically
   - Includes rollback functionality

3. **`check_schema_ci.py`** - CI/CD integration
   - Fast schema consistency check
   - Returns exit code 0 (pass) or 1 (fail)
   - Perfect for deployment pipelines

**Usage Examples:**
```bash
# Full comparison with detailed output
python compare_schemas.py

# Quick check for CI/CD
python check_schema_ci.py

# Auto-generate migration
python sync_schemas.py
```

### Weekly Maintenance

```bash
# Check for orphaned records
railway run psql -c "SELECT 'orphaned quiz results' as check_type, COUNT(*) as count FROM user_quiz_results WHERE user_id NOT IN (SELECT id FROM users);"

# Verify foreign key constraints
railway run psql -c "SELECT conname, conrelid::regclass, confrelid::regclass FROM pg_constraint WHERE contype = 'f' ORDER BY conname;"

# Check index usage
railway run psql -c "SELECT schemaname, tablename, indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;"
```

---

## 💾 Backup and Recovery

### Automated Backups (Railway Managed)

Railway automatically provides:
- Daily database backups
- Point-in-time recovery (up to 7 days)
- Cross-region replication

### Manual Backup Procedures

```bash
# Create schema-only backup
railway run pg_dump --schema-only --no-owner --no-privileges > schema_backup.sql

# Create data-only backup (be careful with large datasets)
railway run pg_dump --data-only --no-owner --no-privileges > data_backup.sql

# Full backup (use with caution for large databases)
railway run pg_dump --no-owner --no-privileges > full_backup.sql
```

### Recovery Procedures

```bash
# Restore from Railway backup (contact Railway support)
# Or restore from your manual backup
railway run psql < backup_file.sql
```

---

## 📊 Performance Monitoring

### Query Performance

```bash
# Check slow queries
railway run psql -c "SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Monitor table sizes
railway run psql -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"

# Check index hit rates
railway run psql -c "SELECT schemaname, tablename, idx_scan, seq_scan FROM pg_stat_user_tables WHERE schemaname = 'public' ORDER BY seq_scan DESC;"
```

### Connection Monitoring

```bash
# Check active connections
railway run psql -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"

# Monitor connection states
railway run psql -c "SELECT state, count(*) FROM pg_stat_activity GROUP BY state ORDER BY count(*) DESC;"
```

---

## 🗃️ Data Management

### User Data Management

```bash
# View user statistics
railway run psql -c "SELECT COUNT(*) as total_users, COUNT(CASE WHEN is_active THEN 1 END) as active_users, COUNT(CASE WHEN is_superuser THEN 1 END) as admins FROM users;"

# Check recent user registrations
railway run psql -c "SELECT created_at::date, COUNT(*) FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' GROUP BY created_at::date ORDER BY created_at::date DESC;"

# Clean up inactive users (CAUTION!)
railway run psql -c "UPDATE users SET is_active = false WHERE last_login < CURRENT_DATE - INTERVAL '1 year';"
```

### Content Management

```bash
# Check content statistics
railway run psql -c "SELECT 'blogs' as type, COUNT(*) as count FROM blogs UNION ALL SELECT 'case_studies', COUNT(*) FROM case_studies UNION ALL SELECT 'conservation_efforts', COUNT(*) FROM conservation_efforts UNION ALL SELECT 'daily_updates', COUNT(*) FROM daily_updates;"

# Find unpublished content
railway run psql -c "SELECT 'blogs' as table_name, COUNT(*) as unpublished FROM blogs WHERE published = false UNION ALL SELECT 'case_studies', COUNT(*) FROM case_studies WHERE published = false;"

# Clean up old draft content
railway run psql -c "DELETE FROM blogs WHERE published = false AND created_at < CURRENT_DATE - INTERVAL '6 months';"
```

### Quiz and Rewards Data

```bash
# Check quiz completion statistics
railway run psql -c "SELECT COUNT(*) as total_attempts, AVG(score_percentage) as avg_score FROM user_quiz_results WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';"

# Monitor rewards distribution
railway run psql -c "SELECT SUM(points_balance) as total_points, SUM(credits_balance) as total_credits FROM users;"

# Check leaderboard data
railway run psql -c "SELECT COUNT(*) as leaderboard_entries FROM leaderboard_entries WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';"
```

---

## 🔄 Schema Updates

### Safe Schema Migration Process

1. **Development Testing**
   ```bash
   # Test migrations locally first
   cd KE_Junglore_Backend
   python -m alembic upgrade head  # Test locally
   python -m alembic downgrade -1  # Test rollback
   ```

2. **Backup Before Migration**
   ```bash
   # Create backup before applying to production
   railway run pg_dump --no-owner --no-privileges > pre_migration_backup.sql
   ```

3. **Apply Migrations to Production**
   ```bash
   # Use external connection for railway run
   railway run "cd KE_Junglore_Backend && python -m alembic upgrade head"
   ```

4. **Verify Migration Success**
   ```bash
   # Check for any errors in Railway logs
   railway logs

   # Verify new schema elements
   railway run psql -c "\d table_name"
   ```

### Recent Schema Fixes (October 2025)

**Issue**: Admin panel queries failing due to missing database columns
- `categories.custom_credits` column missing
- `myths_facts.custom_points` column missing
- Additional missing columns: `is_featured`, `mvf_enabled`, `viewer_count`, `is_active`, `updated_at`

**Root Cause**: Production database schema was out of sync with application code after MVF (Myths vs Facts) feature implementation.

**Resolution Applied**:
```bash
# Added missing columns to categories table
railway run python -c "
import os
os.environ['DATABASE_URL'] = os.environ['DATABASE_PUBLIC_URL']
import asyncio
from app.db.database import get_db_session
from sqlalchemy import text

async def fix():
    async with get_db_session() as db:
        await db.execute(text('ALTER TABLE categories ADD COLUMN IF NOT EXISTS custom_credits INTEGER NULL'))
        await db.execute(text('ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE'))
        await db.execute(text('ALTER TABLE categories ADD COLUMN IF NOT EXISTS mvf_enabled BOOLEAN DEFAULT TRUE'))
        await db.execute(text('ALTER TABLE categories ADD COLUMN IF NOT EXISTS viewer_count INTEGER DEFAULT 0'))
        await db.execute(text('ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE'))
        await db.execute(text('ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'))
        await db.execute(text('ALTER TABLE myths_facts ADD COLUMN IF NOT EXISTS custom_points INTEGER NULL'))
        await db.commit()
        print('✅ Schema fixed')

asyncio.run(fix())
"
```

**Impact**: Admin panel now fully functional for:
- Quiz Management (`/admin/quizzes`)
- Myths vs Facts Management (`/admin/myths-facts`)
- Category Management (`/admin/manage/categories`)

**Prevention**: Always run schema migrations after code deployments that add new database columns.

### Rollback Procedures

```bash
# Rollback last migration
railway run "cd KE_Junglore_Backend && python -m alembic downgrade -1"

# Rollback to specific revision
railway run "cd KE_Junglore_Backend && python -m alembic downgrade abc123"

# Restore from backup if needed
railway run psql < pre_migration_backup.sql
```

---

## 🔒 Security and Access Control

### User Access Management

```bash
# Check admin users
railway run psql -c "SELECT email, is_superuser, is_active FROM users WHERE is_superuser = true;"

# Audit recent admin actions (if logging table exists)
railway run psql -c "SELECT * FROM admin_audit_log ORDER BY created_at DESC LIMIT 10;"

# Reset user password (emergency)
railway run psql -c "UPDATE users SET hashed_password = '$2b$12$newhashedpassword' WHERE email = 'user@example.com';"
```

### Data Privacy Compliance

```bash
# GDPR: Right to be forgotten
railway run psql -c "DELETE FROM users WHERE email = 'user@example.com';"

# Anonymize user data
railway run psql -c "UPDATE users SET email = CONCAT('deleted_', id, '@anonymous.com'), username = CONCAT('user_', id) WHERE is_active = false;"

# Data export for users
railway run psql -c "SELECT * FROM users WHERE email = 'user@example.com';" > user_data_export.csv
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Connection Issues
```bash
# Test database connectivity
railway run python -c "import asyncio; from app.db.database import get_db_session; async def test(): async with get_db_session() as db: result = await db.execute('SELECT 1'); print('DB OK'); asyncio.run(test())"
```

#### Performance Issues
```bash
# Check for long-running queries
railway run psql -c "SELECT pid, now() - pg_stat_activity.query_start as duration, query FROM pg_stat_activity WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '1 minute';"

# Kill long-running query
railway run psql -c "SELECT pg_cancel_backend(pid);"
```

#### Data Integrity Issues
```bash
# Check for foreign key violations
railway run psql -c "SELECT conname, conrelid::regclass, confrelid::regclass FROM pg_constraint WHERE contype = 'f';"

# Find orphaned records
railway run psql -c "SELECT 'quiz_results' as table, COUNT(*) FROM user_quiz_results q LEFT JOIN users u ON q.user_id = u.id WHERE u.id IS NULL;"
```

#### Storage Issues
```bash
# Check database size
railway run psql -c "SELECT pg_size_pretty(pg_database_size(current_database()));"

# Check table sizes
railway run psql -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;"
```

---

## 🚨 Emergency Procedures

### Database Unavailable

1. **Check Railway Status**
   ```bash
   # Check Railway service status
   curl https://status.railway.app/
   ```

2. **Restart Database Service**
   - Go to Railway dashboard
   - Navigate to PostgreSQL service
   - Click "Restart"

3. **Contact Railway Support**
   - If service doesn't restart, contact Railway support
   - Provide incident details and timeline

### Data Loss Incident

1. **Stop All Writes**
   ```bash
   # Put application in maintenance mode
   railway variables set MAINTENANCE_MODE=true
   ```

2. **Assess Damage**
   ```bash
   # Check what data is missing
   railway run psql -c "SELECT COUNT(*) FROM critical_table;"
   ```

3. **Restore from Backup**
   ```bash
   # Use Railway's point-in-time recovery
   # Or restore from manual backup
   railway run psql < backup_file.sql
   ```

4. **Verify Data Integrity**
   ```bash
   # Run all health checks
   railway run python -c "import asyncio; asyncio.run(run_health_checks())"
   ```

### Security Breach

1. **Isolate the Breach**
   ```bash
   # Change all database passwords
   railway variables set DATABASE_URL=new_connection_string
   ```

2. **Audit Access Logs**
   ```bash
   # Check recent connections
   railway run psql -c "SELECT * FROM pg_stat_activity ORDER BY backend_start DESC LIMIT 20;"
   ```

3. **Notify Affected Users**
   - Send security notification emails
   - Reset compromised passwords

---

## 📈 Monitoring and Alerts

### Key Metrics to Monitor

- **Database Connections**: Keep under 80% of max connections
- **Query Performance**: Alert on queries > 5 seconds
- **Storage Usage**: Alert when > 80% of allocated storage
- **Error Rates**: Monitor application error logs
- **User Activity**: Track daily active users and engagement

### Setting Up Alerts

1. **Railway Dashboard**: Set up alerts for CPU, memory, and storage
2. **Application Monitoring**: Use tools like Sentry for error tracking
3. **Custom Alerts**: Set up cron jobs to check key metrics

```bash
# Example monitoring script
railway run python -c "
import asyncio
from app.db.database import get_db_session

async def monitor_health():
    async with get_db_session() as db:
        # Check critical metrics
        result = await db.execute('SELECT COUNT(*) FROM users')
        user_count = result.scalar()
        print(f'Users: {user_count}')
        
        # Add more checks...
        
asyncio.run(monitor_health())
"
```

---

## 🛠️ Maintenance Scripts

### Automated Maintenance

Create a maintenance script (`maintenance.py`) in your backend:

```python
#!/usr/bin/env python3
"""
Automated database maintenance script
"""

import asyncio
from app.db.database import get_db_session
from sqlalchemy import text

async def run_maintenance():
    """Run routine database maintenance"""
    
    async with get_db_session() as db:
        print("🧹 Running database maintenance...")
        
        # Update statistics
        await db.execute(text("ANALYZE;"))
        print("✅ Updated table statistics")
        
        # Clean up old sessions (if applicable)
        # await db.execute(text("DELETE FROM sessions WHERE expires_at < NOW();"))
        
        # Reindex tables if needed
        # await db.execute(text("REINDEX TABLE CONCURRENTLY large_table;"))
        
        await db.commit()
        print("✅ Maintenance complete")

if __name__ == "__main__":
    asyncio.run(run_maintenance())
```

Run weekly:
```bash
railway run "cd KE_Junglore_Backend && python maintenance.py"
```

---

## 📚 Best Practices

### General Guidelines

1. **Always backup before changes**
2. **Test migrations locally first**
3. **Monitor performance after deployments**
4. **Keep detailed change logs**
5. **Regular security audits**

### Performance Optimization

1. **Index Strategy**: Monitor and optimize indexes
2. **Query Optimization**: Use EXPLAIN ANALYZE for slow queries
3. **Connection Pooling**: Proper connection management
4. **Caching**: Implement Redis caching for frequently accessed data

### Security Practices

1. **Regular Updates**: Keep PostgreSQL and dependencies updated
2. **Access Control**: Least privilege principle
3. **Audit Logging**: Log all admin actions
4. **Data Encryption**: Encrypt sensitive data at rest

---

## 📞 Support and Resources

### Railway Support
- **Dashboard**: https://railway.app/dashboard
- **Documentation**: https://docs.railway.app/
- **Community**: https://discord.gg/railway

### PostgreSQL Resources
- **Documentation**: https://www.postgresql.org/docs/
- **Performance Tuning**: https://wiki.postgresql.org/wiki/Performance_Optimization

### Monitoring Tools
- **pg_stat_statements**: Query performance analysis
- **pg_buffercache**: Buffer cache monitoring
- **pg_stat_user_tables**: Table access statistics

---

*This guide should be reviewed and updated quarterly to reflect changes in your platform and Railway's services.*