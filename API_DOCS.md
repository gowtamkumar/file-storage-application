# API Documentation

This application provides API access for programmatic file uploads.

## Authentication

Authentication is handled via an API Key. You can generate your API Key from the User Dashboard.

Include the API Key in the `x-api-key` header of your requests.

```http
x-api-key: sk_your_api_key_here
```

## Endpoints

### Upload File

Upload a file to your storage.

- **URL**: `/api/upload`
- **Method**: `POST`
- **Headers**:
    - `x-api-key`: Your API Key
- **Body**: `FormData`
    - `file`: The file to upload

#### Example Request (cURL)

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "x-api-key: sk_7f8a9b..." \
  -F "file=@/path/to/your/image.png"
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "filename": "1732890000000-image.png",
    "originalName": "image.png",
    "path": "/uploads/1732890000000-image.png",
    "size": 1024,
    "mimetype": "image/png",
    "userId": "656..."
  }
}
```

### Generate API Key

Generate or regenerate your API Key. Note: This invalidates any previous key.

- **URL**: `/api/auth/apikey`
- **Method**: `POST`
- **Authentication**: Requires session (must be logged in via browser)

#### Example Response

```json
{
  "success": true,
  "apiKey": "sk_..."
}
```

Boss, এই API **use করা খুবই simple** — তোমার client (React, Postman, Next.js, mobile app) থেকে শুধু `x-api-key` সহ request পাঠাতে হবে।

আমি তিনভাবে দেখাচ্ছি:

---

# ✅ **1️⃣ Using Postman (Easiest Way)**

Postman খুলে:

### **Step 1:** Method → **POST**

URL →

```
http://localhost:3000/api/upload
```

### **Step 2:** Add Header

Key:

```
x-api-key
```

Value:

```
sk_7f8a9b...
```

### **Step 3:** Select Body → form-data

Add field:

| Key  | Type | Value            |
| ---- | ---- | ---------------- |
| file | File | select any image |

Then → **Send** ✔️

---

# ✅ **2️⃣ Using cURL (Terminal)**

Already given, just replace your file path:

```
curl -X POST http://localhost:3000/api/upload \
  -H "x-api-key: sk_7f8a9b..." \
  -F "file=@/home/gowtam/Desktop/test.png"
```

---

# ✅ **3️⃣ Using JavaScript (React / Next.js / Node.js)**

## 📌 **Example: Upload with Fetch (Next.js / React)**

```ts
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    headers: {
      "x-api-key": "sk_7f8a9b...", // important!
    },
    body: formData,
  });

  const data = await res.json();
  console.log(data);
}
```

Use like:

```ts
<input
  type="file"
  onChange={(e) => uploadImage(e.target.files[0])}
/>
```

---

# ✅ **4️⃣ Using Axios (React / Node.js)**

```ts
import axios from "axios";

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("http://localhost:3000/api/upload", formData, {
    headers: {
      "x-api-key": "sk_7f8a9b...",
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(res.data);
}
```

---

# 📌 **After Upload — API returns**

```
{
  "success": true,
  "data": {
    "filename": "1732890000000-image.png",
    "originalName": "image.png",
    "path": "/uploads/1732890000000-image.png",
    "size": 1024,
    "mimetype": "image/png",
    "userId": "656..."
  }
}
```

### 📌 Get the uploaded file URL:

```
http://localhost:3000/uploads/1732890000000-image.png
```

---

# ⚠️ IMPORTANT (Common mistakes)

❌ Missing `x-api-key` → **401 Unauthorized**
❌ Wrong field name (`file`) → must match backend
❌ Not using form-data → file upload fail
❌ Backend uploads folder not public

If you want, send your backend code — I’ll verify everything is correct.
