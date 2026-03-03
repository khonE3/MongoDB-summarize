# 📗 MongoDB Complete Summary

> สรุป MongoDB อย่างละเอียดครบทุกหัวข้อ ตั้งแต่พื้นฐานจนถึงขั้นสูง

---

## 📑 สารบัญ

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [Basic Concepts](#3-basic-concepts)
4. [CRUD Operations](#4-crud-operations)
5. [Query Operators](#5-query-operators)
6. [Aggregation Framework](#6-aggregation-framework)
7. [Indexing](#7-indexing)
8. [Data Modeling](#8-data-modeling)
9. [Schema Validation](#9-schema-validation)
10. [Transactions](#10-transactions)
11. [Replication](#11-replication)
12. [Sharding](#12-sharding)
13. [Security](#13-security)
14. [Performance Tuning](#14-performance-tuning)
15. [Tools & Drivers](#15-tools--drivers)
16. [MongoDB Atlas](#16-mongodb-atlas)
17. [Best Practices](#17-best-practices)

---

## 1. Introduction

### MongoDB คืออะไร?

MongoDB เป็น **NoSQL Database** แบบ Document-Oriented ที่เก็บข้อมูลในรูปแบบ **BSON** (Binary JSON) ถูกพัฒนาโดย MongoDB Inc. และเป็น Open Source

### NoSQL vs SQL

| Feature        | SQL (MySQL, PostgreSQL) | NoSQL (MongoDB)              |
| -------------- | ----------------------- | ---------------------------- |
| Data Model     | Tables (Rows & Columns) | Collections (Documents)      |
| Schema         | Fixed Schema            | Flexible Schema              |
| Scaling        | Vertical (Scale Up)     | Horizontal (Scale Out)       |
| Relationships  | JOIN                    | Embedding / Referencing      |
| Query Language | SQL                     | MQL (MongoDB Query Language) |
| Transactions   | Full ACID               | ACID (ตั้งแต่ v4.0+)         |

### ข้อดีของ MongoDB

- **Flexible Schema** — ไม่ต้องกำหนดโครงสร้างล่วงหน้า ปรับเปลี่ยนได้ตลอด
- **High Performance** — อ่าน/เขียนเร็วเพราะเก็บเป็น Document
- **Horizontal Scaling** — รองรับ Sharding กระจายข้อมูลข้าม servers
- **Rich Query Language** — รองรับ query ซับซ้อน, aggregation, full-text search
- **Built-in Replication** — มี Replica Set สำหรับ High Availability

### ข้อเสียของ MongoDB

- ไม่เหมาะกับข้อมูลที่ต้อง JOIN ซับซ้อนมาก
- ใช้ Memory สูงกว่า SQL databases
- ไม่รองรับ SQL syntax โดยตรง

### Use Cases ที่เหมาะสม

- Content Management Systems (CMS)
- Real-time Analytics
- IoT Data Storage
- E-commerce Product Catalogs
- Mobile App Backends
- Gaming (Leaderboards, Player Data)

---

## 2. Installation

### Windows

```bash
# ดาวน์โหลด MSI installer จาก https://www.mongodb.com/try/download/community
# หรือใช้ winget
winget install MongoDB.Server
```

### macOS

```bash
# ใช้ Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)

```bash
# Import public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Docker

```bash
# Pull และ Run
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:7.0

# เชื่อมต่อ
docker exec -it mongodb mongosh -u admin -p password
```

### ตรวจสอบการติดตั้ง

```bash
mongosh --version
mongosh          # เข้า MongoDB Shell
```

---

## 3. Basic Concepts

### โครงสร้างข้อมูล

```
MongoDB Server
  └── Database (ฐานข้อมูล)
       └── Collection (เทียบได้กับ Table)
            └── Document (เทียบได้กับ Row)
                 └── Field (เทียบได้กับ Column)
```

### Document

Document คือหน่วยข้อมูลพื้นฐาน เก็บในรูปแบบ BSON (คล้าย JSON):

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "สมชาย",
  "age": 25,
  "email": "somchai@example.com",
  "address": {
    "street": "ถนนสุขุมวิท",
    "city": "กรุงเทพฯ",
    "zipcode": "10110"
  },
  "hobbies": ["อ่านหนังสือ", "เขียนโปรแกรม", "วิ่ง"],
  "createdAt": ISODate("2024-01-15T08:30:00Z")
}
```

### BSON Data Types

| Type             | ตัวอย่าง                   | คำอธิบาย                  |
| ---------------- | -------------------------- | ------------------------- |
| `String`         | `"สวัสดี"`                 | ข้อความ UTF-8             |
| `Number (Int32)` | `42`                       | จำนวนเต็ม 32-bit          |
| `Number (Int64)` | `NumberLong("9999999999")` | จำนวนเต็ม 64-bit          |
| `Double`         | `3.14`                     | ทศนิยม 64-bit             |
| `Decimal128`     | `NumberDecimal("19.99")`   | ทศนิยมแม่นยำสูง (การเงิน) |
| `Boolean`        | `true / false`             | ค่าจริง/เท็จ              |
| `ObjectId`       | `ObjectId("507f1f...")`    | ID อัตโนมัติ 12 bytes     |
| `Date`           | `ISODate("2024-01-01")`    | วันที่/เวลา               |
| `Array`          | `[1, 2, 3]`                | อาร์เรย์                  |
| `Object`         | `{ key: "value" }`         | เอกสารซ้อน                |
| `Null`           | `null`                     | ค่าว่าง                   |
| `Binary`         | `BinData(0, "...")`        | ข้อมูลไบนารี              |
| `Regex`          | `/pattern/i`               | Regular Expression        |
| `Timestamp`      | `Timestamp(1, 1)`          | ใช้ภายใน MongoDB          |

### คำสั่งพื้นฐาน

```javascript
// แสดง databases ทั้งหมด
show dbs

// สร้าง/เลือกใช้ database
use myDatabase

// แสดง collections ทั้งหมด
show collections

// สร้าง collection
db.createCollection("users")

// ลบ collection
db.users.drop()

// ลบ database
db.dropDatabase()

// ดูข้อมูล database ปัจจุบัน
db.stats()
```

---

## 4. CRUD Operations

### Create (สร้างข้อมูล)

```javascript
// แทรกเอกสารเดียว
db.users.insertOne({
  name: "สมชาย",
  age: 25,
  email: "somchai@email.com",
});

// แทรกหลายเอกสาร
db.users.insertMany([
  { name: "สมหญิง", age: 30, email: "somying@email.com" },
  { name: "สมศักดิ์", age: 28, email: "somsak@email.com" },
  { name: "สมศรี", age: 22, email: "somsri@email.com" },
]);
```

### Read (อ่านข้อมูล)

```javascript
// ค้นหาทั้งหมด
db.users.find();

// ค้นหาแบบมีเงื่อนไข
db.users.find({ age: { $gte: 25 } });

// ค้นหาเอกสารแรกที่ตรงเงื่อนไข
db.users.findOne({ name: "สมชาย" });

// เลือก field ที่จะแสดง (Projection)
db.users.find({}, { name: 1, email: 1, _id: 0 });

// เรียงลำดับ (1 = น้อย→มาก, -1 = มาก→น้อย)
db.users.find().sort({ age: -1 });

// จำกัดจำนวนผลลัพธ์
db.users.find().limit(5);

// ข้ามผลลัพธ์ (Pagination)
db.users.find().skip(10).limit(5);

// นับจำนวน
db.users.countDocuments({ age: { $gte: 25 } });

// ค้นหาค่าไม่ซ้ำ
db.users.distinct("city");
```

### Update (อัปเดตข้อมูล)

```javascript
// อัปเดตเอกสารเดียว
db.users.updateOne(
  { name: "สมชาย" },
  { $set: { age: 26, updatedAt: new Date() } },
);

// อัปเดตหลายเอกสาร
db.users.updateMany({ age: { $lt: 25 } }, { $set: { status: "junior" } });

// แทนที่เอกสารทั้งหมด
db.users.replaceOne(
  { name: "สมชาย" },
  { name: "สมชาย", age: 26, email: "new@email.com" },
);

// findOneAndUpdate — อัปเดตและคืนเอกสาร
db.users.findOneAndUpdate(
  { name: "สมชาย" },
  { $inc: { age: 1 } },
  { returnDocument: "after" },
);

// Upsert — ถ้าไม่มีก็สร้างใหม่
db.users.updateOne(
  { email: "new@email.com" },
  { $set: { name: "ใหม่", age: 20 } },
  { upsert: true },
);
```

### Update Operators

| Operator    | ตัวอย่าง                            | คำอธิบาย               |
| ----------- | ----------------------------------- | ---------------------- |
| `$set`      | `{ $set: { name: "ใหม่" } }`        | กำหนดค่า field         |
| `$unset`    | `{ $unset: { age: "" } }`           | ลบ field               |
| `$inc`      | `{ $inc: { age: 1 } }`              | เพิ่ม/ลดค่าตัวเลข      |
| `$mul`      | `{ $mul: { price: 1.1 } }`          | คูณค่าตัวเลข           |
| `$min`      | `{ $min: { score: 50 } }`           | อัปเดตเมื่อค่าน้อยกว่า |
| `$max`      | `{ $max: { score: 100 } }`          | อัปเดตเมื่อค่ามากกว่า  |
| `$rename`   | `{ $rename: { "nm": "name" } }`     | เปลี่ยนชื่อ field      |
| `$push`     | `{ $push: { tags: "new" } }`        | เพิ่มสมาชิกใน array    |
| `$pull`     | `{ $pull: { tags: "old" } }`        | ลบสมาชิกจาก array      |
| `$addToSet` | `{ $addToSet: { tags: "unique" } }` | เพิ่มถ้ายังไม่มี       |
| `$pop`      | `{ $pop: { tags: 1 } }`             | ลบสมาชิกตัวแรก/สุดท้าย |

### Delete (ลบข้อมูล)

```javascript
// ลบเอกสารเดียว
db.users.deleteOne({ name: "สมชาย" });

// ลบหลายเอกสาร
db.users.deleteMany({ age: { $lt: 18 } });

// ลบทุกเอกสารใน collection
db.users.deleteMany({});

// findOneAndDelete — ลบและคืนเอกสาร
db.users.findOneAndDelete({ name: "สมชาย" });
```

### Bulk Operations

```javascript
db.users.bulkWrite(
  [
    { insertOne: { document: { name: "A", age: 20 } } },
    {
      updateOne: {
        filter: { name: "B" },
        update: { $set: { age: 30 } },
      },
    },
    { deleteOne: { filter: { name: "C" } } },
  ],
  { ordered: false },
); // ordered: false = ทำพร้อมกันได้
```

---

## 5. Query Operators

### Comparison Operators

```javascript
// $eq — เท่ากับ
db.users.find({ age: { $eq: 25 } });

// $ne — ไม่เท่ากับ
db.users.find({ status: { $ne: "inactive" } });

// $gt — มากกว่า
db.users.find({ age: { $gt: 20 } });

// $gte — มากกว่าหรือเท่ากับ
db.users.find({ age: { $gte: 18 } });

// $lt — น้อยกว่า
db.users.find({ age: { $lt: 30 } });

// $lte — น้อยกว่าหรือเท่ากับ
db.users.find({ price: { $lte: 100 } });

// $in — อยู่ใน array ที่กำหนด
db.users.find({ status: { $in: ["active", "pending"] } });

// $nin — ไม่อยู่ใน array ที่กำหนด
db.users.find({ role: { $nin: ["admin", "superadmin"] } });
```

### Logical Operators

```javascript
// $and — ตรงทุกเงื่อนไข
db.users.find({
  $and: [{ age: { $gte: 18 } }, { status: "active" }],
});

// $or — ตรงอย่างน้อยหนึ่งเงื่อนไข
db.users.find({
  $or: [{ age: { $lt: 18 } }, { age: { $gt: 65 } }],
});

// $not — ไม่ตรงเงื่อนไข
db.users.find({ age: { $not: { $gte: 18 } } });

// $nor — ไม่ตรงทุกเงื่อนไข
db.users.find({
  $nor: [{ status: "inactive" }, { age: { $lt: 18 } }],
});
```

### Element Operators

```javascript
// $exists — ตรวจว่า field มีอยู่หรือไม่
db.users.find({ email: { $exists: true } });

// $type — ตรวจ type ของ field
db.users.find({ age: { $type: "number" } });
```

### Array Operators

```javascript
// $elemMatch — ตรงเงื่อนไขภายใน array element
db.students.find({
  scores: { $elemMatch: { $gte: 80, $lt: 90 } },
});

// $all — ต้องมีทุก element ที่กำหนด
db.products.find({
  tags: { $all: ["electronics", "sale"] },
});

// $size — ขนาดของ array ตรงกับที่กำหนด
db.users.find({ hobbies: { $size: 3 } });
```

### Evaluation Operators

```javascript
// $regex — ค้นหาด้วย regular expression
db.users.find({ name: { $regex: /^สม/, $options: "i" } });

// $expr — ใช้ aggregation expression ใน query
db.orders.find({
  $expr: { $gt: ["$total", "$budget"] },
});

// $text — Full-text search (ต้องสร้าง text index ก่อน)
db.articles.createIndex({ content: "text" });
db.articles.find({ $text: { $search: "mongodb tutorial" } });

// $where — ใช้ JavaScript expression (ช้า ไม่แนะนำ)
db.users.find({ $where: "this.age > 20" });
```

---

## 6. Aggregation Framework

### Pipeline Concept

Aggregation Pipeline ทำงานแบบขั้นตอน โดยผลลัพธ์ของ stage หนึ่งจะส่งต่อไปยัง stage ถัดไป:

```
Documents → [$match] → [$group] → [$sort] → [$project] → Results
```

### Pipeline Stages

```javascript
// $match — กรองข้อมูล (เหมือน WHERE)
db.orders.aggregate([{ $match: { status: "completed" } }]);

// $group — จัดกลุ่มและคำนวณ (เหมือน GROUP BY)
db.orders.aggregate([
  {
    $group: {
      _id: "$category",
      totalSales: { $sum: "$amount" },
      avgPrice: { $avg: "$price" },
      count: { $sum: 1 },
      maxPrice: { $max: "$price" },
      minPrice: { $min: "$price" },
    },
  },
]);

// $project — เลือก/สร้าง field (เหมือน SELECT)
db.users.aggregate([
  {
    $project: {
      fullName: { $concat: ["$firstName", " ", "$lastName"] },
      age: 1,
      _id: 0,
    },
  },
]);

// $sort — เรียงลำดับ
db.orders.aggregate([{ $sort: { totalSales: -1 } }]);

// $limit & $skip — จำกัดและข้ามผลลัพธ์
db.orders.aggregate([{ $skip: 10 }, { $limit: 5 }]);

// $unwind — แตก array เป็นหลายเอกสาร
db.orders.aggregate([{ $unwind: "$items" }]);

// $lookup — JOIN กับ collection อื่น
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails",
    },
  },
]);

// $addFields — เพิ่ม field ใหม่
db.users.aggregate([
  {
    $addFields: {
      fullName: { $concat: ["$firstName", " ", "$lastName"] },
    },
  },
]);

// $count — นับจำนวน
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $count: "completedOrders" },
]);

// $facet — รัน pipeline หลายสายพร้อมกัน
db.products.aggregate([
  {
    $facet: {
      priceStats: [{ $group: { _id: null, avg: { $avg: "$price" } } }],
      categoryCount: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
    },
  },
]);
```

### ตัวอย่าง Aggregation จริง

```javascript
// รายงานยอดขายรายเดือน
db.orders.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      },
      totalRevenue: { $sum: "$total" },
      orderCount: { $sum: 1 },
      avgOrderValue: { $avg: "$total" },
    },
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } },
  {
    $project: {
      _id: 0,
      period: {
        $concat: [{ $toString: "$_id.year" }, "-", { $toString: "$_id.month" }],
      },
      totalRevenue: { $round: ["$totalRevenue", 2] },
      orderCount: 1,
      avgOrderValue: { $round: ["$avgOrderValue", 2] },
    },
  },
]);
```

---

## 7. Indexing

### ทำไมต้องใช้ Index?

Index ช่วยให้ MongoDB ค้นหาข้อมูลได้เร็วขึ้นโดยไม่ต้อง scan ทุก document (Collection Scan → Index Scan)

### ประเภทของ Index

```javascript
// Single Field Index
db.users.createIndex({ email: 1 }); // 1 = ascending
db.users.createIndex({ age: -1 }); // -1 = descending

// Compound Index (หลาย field)
db.orders.createIndex({ userId: 1, createdAt: -1 });

// Unique Index (ค่าห้ามซ้ำ)
db.users.createIndex({ email: 1 }, { unique: true });

// TTL Index (ลบเอกสารอัตโนมัติตามเวลา)
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }, // ลบหลัง 1 ชม.
);

// Text Index (Full-text search)
db.articles.createIndex({
  title: "text",
  content: "text",
});

// Multikey Index (สำหรับ array fields)
db.products.createIndex({ tags: 1 });

// Geospatial Index (2dsphere)
db.places.createIndex({ location: "2dsphere" });

// Partial Index (index เฉพาะเอกสารที่ตรงเงื่อนไข)
db.users.createIndex(
  { email: 1 },
  { partialFilterExpression: { status: "active" } },
);

// Wildcard Index
db.products.createIndex({ "attributes.$**": 1 });
```

### จัดการ Index

```javascript
// ดู indexes ทั้งหมด
db.users.getIndexes();

// ลบ index
db.users.dropIndex("email_1");
db.users.dropIndexes(); // ลบทั้งหมด (ยกเว้น _id)

// ตรวจสอบ query ใช้ index หรือไม่
db.users.find({ email: "test@email.com" }).explain("executionStats");
```

### explain() Output ที่ควรดู

| Field                 | ค่าที่ดี      | หมายถึง                     |
| --------------------- | ------------- | --------------------------- |
| `winningPlan.stage`   | `IXSCAN`      | ใช้ Index                   |
| `winningPlan.stage`   | `COLLSCAN`    | Scan ทั้ง collection (ช้า!) |
| `totalDocsExamined`   | ≈ `nReturned` | ไม่ scan เกินจำเป็น         |
| `executionTimeMillis` | ต่ำ           | Query เร็ว                  |

---

## 8. Data Modeling

### Embedding vs Referencing

#### Embedding (ฝังข้อมูล)

```javascript
// เหมาะกับ: 1:1, 1:Few relationships
{
  _id: ObjectId("..."),
  name: "สมชาย",
  address: {                    // ← Embedded document
    street: "ถนนสุขุมวิท",
    city: "กรุงเทพฯ",
    zipcode: "10110"
  },
  orders: [                     // ← Embedded array
    { product: "สินค้า A", qty: 2, price: 100 },
    { product: "สินค้า B", qty: 1, price: 200 }
  ]
}
```

**ข้อดี**: อ่านเร็ว (ไม่ต้อง JOIN), Atomic update ได้ทั้ง document  
**ข้อเสีย**: Document ใหญ่เกิน 16MB ไม่ได้, ข้อมูลซ้ำซ้อน

#### Referencing (อ้างอิง)

```javascript
// Collection: users
{ _id: ObjectId("user1"), name: "สมชาย" }

// Collection: orders
{
  _id: ObjectId("order1"),
  userId: ObjectId("user1"),    // ← Reference
  product: "สินค้า A",
  total: 500
}
```

**ข้อดี**: ไม่ซ้ำซ้อน, Document ไม่บวม  
**ข้อเสีย**: ต้อง query หลายรอบ หรือใช้ `$lookup`

### เลือกใช้เมื่อไหร่?

| เกณฑ์              | Embedding        | Referencing          |
| ------------------ | ---------------- | -------------------- |
| ความสัมพันธ์       | 1:1, 1:Few       | 1:Many, Many:Many    |
| อ่านบ่อยแค่ไหน     | อ่านบ่อยพร้อมกัน | อ่านแยกกัน           |
| ข้อมูลเปลี่ยนบ่อย? | ไม่ค่อยเปลี่ยน   | เปลี่ยนบ่อย          |
| ขนาดข้อมูล         | เล็ก (<16MB)     | ใหญ่หรือโตได้เรื่อยๆ |

### Schema Design Patterns

```javascript
// Pattern: Bucket — จัดกลุ่มข้อมูล time-series
{
  sensorId: "sensor_001",
  date: ISODate("2024-01-15"),
  readings: [
    { time: "08:00", value: 22.5 },
    { time: "08:05", value: 22.7 },
    // ... 288 readings per day
  ],
  count: 288
}

// Pattern: Computed — เก็บค่าที่คำนวณไว้ล่วงหน้า
{
  productId: ObjectId("..."),
  totalReviews: 150,
  avgRating: 4.5,
  lastUpdated: ISODate("2024-01-15")
}

// Pattern: Extended Reference — เก็บข้อมูลที่ใช้บ่อยซ้ำ
{
  orderId: ObjectId("..."),
  customer: {
    _id: ObjectId("cust1"),
    name: "สมชาย",        // ← duplicate แต่ใช้บ่อย
    email: "s@email.com"  // ← duplicate แต่ใช้บ่อย
  }
}
```

---

## 9. Schema Validation

```javascript
// สร้าง collection พร้อม validation
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price", "category"],
      properties: {
        name: {
          bsonType: "string",
          description: "ต้องเป็น string และห้ามว่าง",
        },
        price: {
          bsonType: "number",
          minimum: 0,
          description: "ต้องเป็นตัวเลข >= 0",
        },
        category: {
          enum: ["electronics", "books", "clothing"],
          description: "ต้องเป็นหมวดที่กำหนด",
        },
        tags: {
          bsonType: "array",
          items: { bsonType: "string" },
        },
      },
    },
  },
  validationLevel: "strict", // strict | moderate
  validationAction: "error", // error | warn
});

// เพิ่ม validation ให้ collection ที่มีอยู่
db.runCommand({
  collMod: "products",
  validator: {
    $jsonSchema: {
      /* ... */
    },
  },
});
```

---

## 10. Transactions

### Single Document Atomicity

MongoDB รับประกัน atomicity ในระดับ single document เสมอ:

```javascript
// Atomic operation — สำเร็จหรือล้มเหลวทั้งหมด
db.accounts.updateOne(
  { _id: "account1" },
  {
    $inc: { balance: -100 },
    $push: { transactions: { type: "withdraw", amount: 100 } },
  },
);
```

### Multi-Document Transactions (v4.0+)

```javascript
const session = db.getMongo().startSession();
session.startTransaction();

try {
  const accounts = session.getDatabase("bank").accounts;

  // โอนเงิน: หักจากบัญชี A
  accounts.updateOne(
    { _id: "accountA" },
    { $inc: { balance: -500 } },
    { session },
  );

  // โอนเงิน: เพิ่มให้บัญชี B
  accounts.updateOne(
    { _id: "accountB" },
    { $inc: { balance: 500 } },
    { session },
  );

  session.commitTransaction();
  print("โอนเงินสำเร็จ!");
} catch (error) {
  session.abortTransaction();
  print("เกิดข้อผิดพลาด: " + error);
} finally {
  session.endSession();
}
```

---

## 11. Replication

### Replica Set คืออะไร?

กลุ่มของ MongoDB instances ที่เก็บข้อมูลชุดเดียวกัน เพื่อ High Availability:

```
        ┌─────────────┐
        │   Primary   │  ← รับ Write/Read
        └──────┬──────┘
               │ Replication
       ┌───────┴───────┐
┌──────┴──────┐ ┌──────┴──────┐
│ Secondary 1 │ │ Secondary 2 │  ← รับ Read (ถ้าตั้งค่า)
└─────────────┘ └─────────────┘
```

### ตั้งค่า Replica Set

```javascript
// เริ่มต้น Replica Set
rs.initiate({
  _id: "myReplicaSet",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" },
  ],
});

// ตรวจสถานะ
rs.status();

// เพิ่ม member
rs.add("mongo4:27017");

// ลบ member
rs.remove("mongo4:27017");
```

### Read Preference

| Mode                 | คำอธิบาย                                       |
| -------------------- | ---------------------------------------------- |
| `primary`            | อ่านจาก Primary เท่านั้น (default)             |
| `primaryPreferred`   | อ่านจาก Primary ถ้าได้ ถ้าไม่ได้อ่าน Secondary |
| `secondary`          | อ่านจาก Secondary เท่านั้น                     |
| `secondaryPreferred` | อ่านจาก Secondary ถ้าได้                       |
| `nearest`            | อ่านจาก node ที่ใกล้ที่สุด (latency ต่ำสุด)    |

---

## 12. Sharding

### Sharding คืออะไร?

การกระจายข้อมูลไปหลาย servers (horizontal scaling):

```
            ┌──────────┐
            │  mongos   │  ← Router
            └─────┬────┘
       ┌──────────┼──────────┐
┌──────┴─────┐ ┌──┴──────┐ ┌─┴──────────┐
│  Shard 1   │ │ Shard 2 │ │  Shard 3   │
│ (data A-H) │ │(data I-P)│ │ (data Q-Z) │
└────────────┘ └─────────┘ └────────────┘
       Config Servers (metadata)
```

### การตั้งค่า

```javascript
// เปิดใช้ sharding สำหรับ database
sh.enableSharding("myDatabase");

// เลือก shard key และ shard collection
sh.shardCollection("myDatabase.orders", { region: 1 });

// ดูสถานะ
sh.status();
```

### เลือก Shard Key

| Shard Key ที่ดี  | Shard Key ที่ไม่ดี               |
| ---------------- | -------------------------------- |
| High Cardinality | Low Cardinality (เช่น boolean)   |
| กระจายสม่ำเสมอ   | Monotonic (เช่น \_id, timestamp) |
| ใช้ใน query บ่อย | ไม่ค่อยใช้ใน query               |

---

## 13. Security

### Authentication

```javascript
// สร้าง admin user
use admin
db.createUser({
  user: "admin",
  pwd: "strongPassword123!",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
})

// สร้าง user สำหรับ database เฉพาะ
use myApp
db.createUser({
  user: "appUser",
  pwd: "appPassword",
  roles: [
    { role: "readWrite", db: "myApp" },
    { role: "read", db: "reporting" }
  ]
})
```

### Built-in Roles

| Role           | สิทธิ์                         |
| -------------- | ------------------------------ |
| `read`         | อ่านข้อมูล                     |
| `readWrite`    | อ่าน + เขียน                   |
| `dbAdmin`      | จัดการ database (index, stats) |
| `userAdmin`    | จัดการ users                   |
| `clusterAdmin` | จัดการ cluster                 |
| `root`         | สิทธิ์ทั้งหมด                  |

### Connection String พร้อม Auth

```
mongodb://appUser:appPassword@localhost:27017/myApp?authSource=myApp
```

---

## 14. Performance Tuning

### วิเคราะห์ Query ด้วย explain()

```javascript
db.users.find({ email: "test@email.com" }).explain("executionStats");

// ค่าที่ต้องดู:
// - executionStats.executionTimeMillis (ยิ่งต่ำยิ่งดี)
// - executionStats.totalDocsExamined (ยิ่งเท่า nReturned ยิ่งดี)
// - winningPlan.stage (IXSCAN ดีกว่า COLLSCAN)
```

### Database Profiler

```javascript
// เปิด profiler (level 2 = บันทึกทุก query)
db.setProfilingLevel(2);

// บันทึกเฉพาะ query ที่ช้ากว่า 100ms
db.setProfilingLevel(1, { slowms: 100 });

// ดู slow queries
db.system.profile.find().sort({ millis: -1 }).limit(5);

// ปิด profiler
db.setProfilingLevel(0);
```

### Tips เพิ่มประสิทธิภาพ

1. **สร้าง Index** ให้ field ที่ใช้ค้นหาบ่อย
2. **ใช้ Projection** เลือกแค่ field ที่ต้องการ
3. **หลีกเลี่ยง `$where`** เพราะช้ามาก
4. **ใช้ `$limit` กับ `$sort`** ร่วมกันเพื่อลดข้อมูลที่ต้องประมวลผล
5. **Connection Pooling** ตั้งค่า pool size ให้เหมาะสม
6. **ใช้ Covered Query** เมื่อ index ครอบคลุมทุก field ที่ต้องการ

---

## 15. Tools & Drivers

### mongosh (MongoDB Shell)

```bash
# เชื่อมต่อ
mongosh "mongodb://localhost:27017"
mongosh "mongodb+srv://cluster.mongodb.net/mydb" --username admin

# Useful commands
cls                  # ล้างหน้าจอ
exit                 # ออก
load("script.js")    # โหลด script
```

### MongoDB Compass

GUI Tool สำหรับจัดการ MongoDB — ดู collections, สร้าง query แบบ visual, ดู explain plan, จัดการ indexes

### Backup & Restore

```bash
# Export ทั้ง database
mongodump --uri="mongodb://localhost:27017" --db=myApp --out=./backup

# Import กลับ
mongorestore --uri="mongodb://localhost:27017" --db=myApp ./backup/myApp

# Export เป็น JSON
mongoexport --db=myApp --collection=users --out=users.json --jsonArray

# Import จาก JSON
mongoimport --db=myApp --collection=users --file=users.json --jsonArray
```

### Node.js Driver

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("myApp");
const users = db.collection("users");

// CRUD
await users.insertOne({ name: "สมชาย", age: 25 });
const user = await users.findOne({ name: "สมชาย" });
await users.updateOne({ name: "สมชาย" }, { $set: { age: 26 } });
await users.deleteOne({ name: "สมชาย" });

await client.close();
```

### Mongoose (ODM)

```javascript
import mongoose from "mongoose";

await mongoose.connect("mongodb://localhost:27017/myApp");

// Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 0 },
  email: { type: String, unique: true, lowercase: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// CRUD
const user = await User.create({ name: "สมชาย", age: 25 });
const found = await User.findOne({ name: "สมชาย" });
await User.findByIdAndUpdate(user._id, { age: 26 });
await User.findByIdAndDelete(user._id);
```

---

## 16. MongoDB Atlas

### คืออะไร?

MongoDB Atlas คือ **Database-as-a-Service (DBaaS)** บน Cloud — รองรับ AWS, GCP, Azure

### เริ่มต้นใช้งาน

1. สมัครที่ [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. สร้าง Cluster (Free Tier: M0 — 512MB)
3. ตั้งค่า Network Access (IP Whitelist)
4. สร้าง Database User
5. เชื่อมต่อด้วย Connection String

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myApp?retryWrites=true&w=majority
```

### Features

- **Auto Scaling** — ปรับขนาดอัตโนมัติ
- **Backup** — Continuous backup + Point-in-time restore
- **Monitoring** — Real-time performance metrics
- **Atlas Search** — Full-text search engine (ใช้ Lucene)
- **Data API** — RESTful API สำหรับเข้าถึงข้อมูล
- **Triggers** — Serverless functions ตอบสนองต่อ events

---

## 17. Best Practices

### Naming Conventions

- **Database**: ตัวเล็ก, ไม่มีช่องว่าง → `my_app`, `ecommerce`
- **Collection**: พหูพจน์, camelCase หรือ snake_case → `users`, `orderItems`
- **Field**: camelCase → `firstName`, `createdAt`, `isActive`

### Schema Design

- ✅ ออกแบบ schema ตาม **query pattern** ไม่ใช่ตามโครงสร้างข้อมูล
- ✅ Embed ข้อมูลที่อ่านพร้อมกันเสมอ
- ✅ Reference ข้อมูลที่โตได้ไม่จำกัด
- ❌ อย่าสร้าง document ใหญ่เกิน 16MB
- ❌ อย่า embed array ที่โตได้ไม่จำกัด

### Production Checklist

- ✅ เปิด Authentication เสมอ
- ✅ ใช้ Replica Set (อย่างน้อย 3 members)
- ✅ สร้าง Index สำหรับ query ที่ใช้บ่อย
- ✅ ตั้งค่า Connection Pooling
- ✅ Monitor ด้วย Atlas หรือ Prometheus + Grafana
- ✅ ตั้ง Backup schedule
- ✅ ใช้ TLS/SSL สำหรับ connection
- ✅ จำกัด Network Access

### Anti-Patterns ที่ควรหลีกเลี่ยง

| ❌ Anti-Pattern            | ✅ แนะนำ                                |
| -------------------------- | --------------------------------------- |
| ใช้ `$where` ใน query      | ใช้ native operators                    |
| ไม่สร้าง Index             | วิเคราะห์ query pattern แล้วสร้าง Index |
| Embed unbounded arrays     | Reference หรือใช้ Bucket pattern        |
| เก็บไฟล์ใหญ่ใน document    | ใช้ GridFS                              |
| ใช้ COLLSCAN ใน production | สร้าง Index ให้เหมาะสม                  |
| ไม่ validate input         | ใช้ Schema Validation                   |

---

## 📚 Official Resources

- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

> 📝 **หมายเหตุ**: เอกสารนี้สรุปจาก MongoDB v7.0+ — บางฟีเจอร์อาจไม่มีใน version เก่า

> 🌐 **Interactive Examples**: ดูตัวอย่างการใช้งานแบบ Interactive ได้ที่ [Web Demo](./web/index.html)
