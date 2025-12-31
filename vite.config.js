import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'src': '/src'
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    three: ['three', '@react-three/fiber', '@react-three/drei'],
                    mui: ['@mui/material', '@mui/icons-material']
                }
            }
        }
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '/api/v1')
            },
            '/uploads': {
                target: process.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000',
                changeOrigin: true,
                secure: false
            }
        }
    }
}) 