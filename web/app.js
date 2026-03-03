/* ============================================
   MongoDB Interactive Examples — App Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ===== DOM Elements =====
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const mobileMenu = document.getElementById('mobileMenu');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  const pageTitle = document.getElementById('pageTitle');
  const featureCards = document.querySelectorAll('.feature-card');
  const tabButtons = document.querySelectorAll('.tab');
  const runButtons = document.querySelectorAll('.run-btn');

  // ===== Navigation =====
  function navigateTo(sectionId) {
    // Update nav
    navItems.forEach(item => item.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update section
    sections.forEach(s => s.classList.remove('active'));
    const activeSection = document.getElementById(`section-${sectionId}`);
    if (activeSection) {
      activeSection.classList.remove('active');
      // Force reflow for animation
      void activeSection.offsetWidth;
      activeSection.classList.add('active');
    }

    // Update title
    const titles = {
      overview: 'Overview',
      crud: 'CRUD Operations',
      query: 'Query Operators',
      aggregation: 'Aggregation Framework',
      indexing: 'Indexing',
      modeling: 'Data Modeling',
      transactions: 'Transactions',
      mongoose: 'Mongoose ODM'
    };
    pageTitle.textContent = titles[sectionId] || 'Overview';

    // Close mobile sidebar
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.section);
    });
  });

  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      const goto = card.dataset.goto;
      if (goto) navigateTo(goto);
    });
  });

  // ===== Mobile Menu =====
  mobileMenu.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });

  // ===== Tabs =====
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      const parent = btn.closest('.section');

      // Update tab buttons
      parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      // Update tab content
      parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      const target = parent.querySelector(`#tab-${tabId}`);
      if (target) target.classList.add('active');
    });
  });

  // ===== Run Button — Simulated Results =====
  const exampleResults = {
    insertOne: {
      acknowledged: true,
      insertedId: 'ObjectId("65a1b2c3d4e5f6a7b8c9d0e1")'
    },
    insertMany: {
      acknowledged: true,
      insertedIds: {
        0: 'ObjectId("65a1b2c3d4e5f6a7b8c9d0e2")',
        1: 'ObjectId("65a1b2c3d4e5f6a7b8c9d0e3")',
        2: 'ObjectId("65a1b2c3d4e5f6a7b8c9d0e4")'
      }
    },
    find: [
      { _id: 'ObjectId("...")', name: 'สมชาย', age: 25, email: 'somchai@email.com' },
      { _id: 'ObjectId("...")', name: 'สมหญิง', age: 30, email: 'somying@email.com' },
      { _id: 'ObjectId("...")', name: 'สมศักดิ์', age: 28, email: 'somsak@email.com' }
    ],
    findAdvanced: {
      'sort + limit (top 2 oldest)': [
        { name: 'สมหญิง', age: 30 },
        { name: 'สมศักดิ์', age: 28 }
      ],
      'skip(2) + limit(2)': [
        { name: 'สมศรี', age: 22 }
      ]
    },
    updateOne: {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedId: null
    },
    delete: {
      'deleteOne result': { acknowledged: true, deletedCount: 1 },
      'deleteMany result': { acknowledged: true, deletedCount: 3 }
    },
    bulk: {
      acknowledged: true,
      insertedCount: 1,
      matchedCount: 1,
      modifiedCount: 1,
      deletedCount: 1,
      upsertedCount: 0
    },
    comparison: [
      { name: 'สมชาย', age: 25, city: 'กรุงเทพฯ' },
      { name: 'สมศักดิ์', age: 28, city: 'กรุงเทพฯ' },
      { name: 'สมหญิง', age: 30, city: 'เชียงใหม่' }
    ],
    logical: {
      '$and result (active AND age >= 18)': [
        { name: 'สมชาย', age: 25, status: 'active' },
        { name: 'สมหญิง', age: 30, status: 'active' }
      ],
      '$or result (age < 18 OR age > 65)': [
        { name: 'น้องเอ', age: 15 },
        { name: 'คุณปู่', age: 70 }
      ]
    },
    arrayOps: {
      '$elemMatch (scores 80-90)': [
        { name: 'สมชาย', scores: [75, 82, 95] },
        { name: 'สมหญิง', scores: [88, 92, 78] }
      ],
      '$all (tags: sale + new)': [
        { name: 'สินค้า A', tags: ['sale', 'new', 'hot'] }
      ],
      '$size (3 hobbies)': [
        { name: 'สมชาย', hobbies: ['coding', 'gaming', 'reading'] }
      ]
    },
    evaluation: {
      '$regex (ชื่อขึ้นต้นด้วย "สม")': [
        { name: 'สมชาย' },
        { name: 'สมหญิง' },
        { name: 'สมศักดิ์' }
      ],
      '$text search': [
        { title: 'MongoDB Aggregation Guide', score: 1.5 },
        { title: 'Getting Started with MongoDB', score: 1.2 }
      ]
    },
    aggSales: [
      { category: 'Electronics', totalRevenue: 125450.00, orderCount: 342, avgOrder: 366.81 },
      { category: 'Clothing', totalRevenue: 89230.50, orderCount: 567, avgOrder: 157.37 },
      { category: 'Books', totalRevenue: 45120.75, orderCount: 890, avgOrder: 50.70 },
      { category: 'Food', totalRevenue: 32100.25, orderCount: 1205, avgOrder: 26.64 }
    ],
    aggLookup: [
      {
        orderId: 'ObjectId("o1")',
        product: 'MacBook Pro',
        total: 55900,
        customerName: 'สมชาย',
        customerEmail: 'somchai@email.com'
      },
      {
        orderId: 'ObjectId("o2")',
        product: 'iPhone 15',
        total: 38900,
        customerName: 'สมหญิง',
        customerEmail: 'somying@email.com'
      }
    ],
    aggFacet: {
      priceStats: [{ avgPrice: 1250.50, maxPrice: 55900, minPrice: 29 }],
      categoryBreakdown: [
        { _id: 'Electronics', count: 342 },
        { _id: 'Clothing', count: 567 },
        { _id: 'Books', count: 890 }
      ],
      topExpensive: [
        { name: 'MacBook Pro', price: 55900 },
        { name: 'iPhone 15', price: 38900 },
        { name: 'iPad Air', price: 22900 }
      ]
    },
    indexTypes: {
      message: 'Indexes created successfully ✅',
      indexes: [
        { name: 'email_1', type: 'Single Field', unique: true },
        { name: 'userId_1_createdAt_-1', type: 'Compound' },
        { name: 'createdAt_1', type: 'TTL', expireAfterSeconds: 3600 },
        { name: 'title_text_content_text', type: 'Text' }
      ]
    },
    explain: {
      queryPlanner: {
        winningPlan: {
          stage: 'IXSCAN',
          indexName: 'email_1',
          direction: 'forward'
        }
      },
      executionStats: {
        executionSuccess: true,
        nReturned: 1,
        executionTimeMillis: 0,
        totalDocsExamined: 1,
        totalKeysExamined: 1
      }
    },
    singleAtomic: {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      result: {
        _id: 'account1',
        balance: 4900,
        transactions: [
          '... previous transactions ...',
          { type: 'withdraw', amount: 100, date: '2024-01-15T10:30:00Z' }
        ]
      }
    },
    multiTx: {
      status: 'Transaction committed ✅',
      before: {
        accountA: { balance: 10000 },
        accountB: { balance: 5000 }
      },
      after: {
        accountA: { balance: 9500 },
        accountB: { balance: 5500 }
      },
      message: 'โอนเงิน ฿500 จาก A → B สำเร็จ!'
    },
    mongooseSchema: {
      message: 'Schema & Model created ✅',
      schema: {
        name: 'String (required, trimmed)',
        email: 'String (required, unique, lowercase)',
        age: 'Number (min: 0, max: 150)',
        role: "String (enum: ['user', 'admin'], default: 'user')",
        tags: '[String]',
        profile: '{ avatar: String, bio: String(max: 500) }',
        createdAt: 'Date (auto)',
        updatedAt: 'Date (auto)'
      }
    },
    mongooseCrud: {
      create: {
        _id: 'ObjectId("65a1b...")',
        name: 'สมชาย',
        email: 'somchai@email.com',
        age: 25,
        role: 'user',
        createdAt: '2024-01-15T08:30:00Z'
      },
      findOne: {
        name: 'สมชาย',
        email: 'somchai@email.com',
        age: 25
      },
      updateResult: {
        name: 'สมชาย',
        age: 26,
        updatedAt: '2024-01-15T09:00:00Z'
      },
      deleteResult: { acknowledged: true, deletedCount: 1 }
    },
    mongooseMiddleware: {
      'pre-save': 'Password will be auto-hashed before saving ✅',
      'virtual (fullName)': '"สมชาย ใจดี" (computed, not stored in DB)',
      'static (findByEmail)': 'User.findByEmail("test@email.com") → returns user',
      'instance (isAdmin)': 'user.isAdmin() → false'
    }
  };

  runButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const exampleId = btn.dataset.example;
      const resultBlock = document.getElementById(`result-${exampleId}`);
      if (!resultBlock) return;

      // Toggle
      if (!resultBlock.classList.contains('hidden')) {
        resultBlock.classList.add('hidden');
        btn.textContent = '▶ Run';
        return;
      }

      // Simulate running
      btn.textContent = '⏳ Running...';
      btn.classList.add('running');

      setTimeout(() => {
        const data = exampleResults[exampleId];
        const output = resultBlock.querySelector('.result-output');
        output.textContent = JSON.stringify(data, null, 2);
        resultBlock.classList.remove('hidden');
        btn.textContent = '✕ Hide';
        btn.classList.remove('running');
      }, 600);
    });
  });

  // ===== Keyboard Navigation =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    }
  });
});
