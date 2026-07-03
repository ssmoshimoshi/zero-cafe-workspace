#!/bin/bash

# deploy.sh - Script untuk otomatis push ke GitHub dan Google Apps Script (clasp)

echo "=== Memulai Proses Deploy ==="

# 1. Tambah file dan commit ke Git lokal
echo "1. Melakukan Git commit..."
git add .
# Jika ada perubahan, commit. Jika tidak ada, lanjutkan saja
git commit -m "Pembaruan otomatis: $(date '+%Y-%m-%d %H:%M:%S')" || echo "Tidak ada perubahan kode baru untuk di-commit."

# 2. Push ke GitHub (hanya jika remote 'origin' sudah ditambahkan oleh user)
if git remote | grep -q 'origin'; then
  echo "2. Melakukan push ke GitHub (origin)..."
  # Menentukan branch aktif saat ini
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  git push origin "$CURRENT_BRANCH"
else
  echo "2. [INFO] Remote 'origin' belum dikonfigurasi. Lewati langkah push GitHub."
  echo "   (Hubungkan ke repositori GitHub baru Anda terlebih dahulu dengan perintah yang diberikan)"
fi

# 3. Push ke Google Apps Script via clasp
echo "3. Melakukan push dan deploy ke Google Apps Script..."
clasp push
# Deploy ke ID utama (@52)
clasp deploy -i AKfycbz7mSoOmKpOtZnACm0LwFnmOGtZL-KlUOekGzylA8b20_j9mMsom1dgaSNExQ2OJTUp -d "Pembaruan otomatis dari deploy.sh"
# Deploy ke ID versi lama (@50) agar tersinkronisasi
clasp deploy -i AKfycbzmjpOPY34k7AQ4YTieRxRwnkGKsWsPH6-Xcl4bZK4nvNLRIAbOOKONRnMVFCE3ZjWf -d "Sinkronisasi versi lama"

echo "=== Selesai! Aplikasi Anda telah diperbarui di GAS dan GitHub ==="
# Deploy ke Zero Report
clasp deploy -i AKfycbw_W9Mg6uFdpXy_VUQnMLCPS77O5-yLcSQ9BmtWi45xkIb1-2_2JU2EThhGt18Azq2S -d "Pembaruan otomatis dari deploy.sh"
