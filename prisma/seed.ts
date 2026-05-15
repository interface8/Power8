import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── 1. Create Permissions ───────────────────────────
  const permissionDefs = [
    // Users
    { resource: "users", action: "create", description: "Create users" },
    { resource: "users", action: "read", description: "View users" },
    { resource: "users", action: "update", description: "Update users" },
    { resource: "users", action: "delete", description: "Delete users" },
    // Roles
    { resource: "roles", action: "create", description: "Create roles" },
    { resource: "roles", action: "read", description: "View roles" },
    { resource: "roles", action: "update", description: "Update roles" },
    { resource: "roles", action: "delete", description: "Delete roles" },
    // Permissions
    { resource: "permissions", action: "create", description: "Create permissions" },
    { resource: "permissions", action: "read", description: "View permissions" },
    { resource: "permissions", action: "update", description: "Update permissions" },
    { resource: "permissions", action: "delete", description: "Delete permissions" },
    // Bundles
    { resource: "bundles", action: "create", description: "Create bundles" },
    { resource: "bundles", action: "update", description: "Update bundles" },
    // Companies
    { resource: "companies", action: "create", description: "Create companies" },
    { resource: "companies", action: "update", description: "Update companies" },
    { resource: "companies", action: "delete", description: "Delete companies" },
    // Products
    { resource: "products", action: "create", description: "Create products" },
    { resource: "products", action: "update", description: "Update products" },
    { resource: "products", action: "delete", description: "Delete products" },
    // Blogs
    { resource: "blogs", action: "create", description: "Create blogs" },
    { resource: "blogs", action: "update", description: "Update blogs" },
    { resource: "blogs", action: "delete", description: "Delete blogs" },
    // Blog Categories
    { resource: "blog-categories", action: "create", description: "Create blog categories" },
    // Product Categories
    { resource: "product-categories", action: "create", description: "Create product categories" },
    { resource: "product-categories", action: "update", description: "Update product categories" },
    { resource: "product-categories", action: "delete", description: "Delete product categories" },
    // Systems
    { resource: "systems", action: "control", description: "Control solar systems" },
  ];

  const permissions = [];
  for (const def of permissionDefs) {
    const permission = await prisma.permission.upsert({
      where: { resource_action: { resource: def.resource, action: def.action } },
      update: {},
      create: def,
    });
    permissions.push(permission);
  }

  console.log(`  ✅ ${permissions.length} permissions created`);

  // ─── 2. Create Admin Role with all permissions ───────
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Full system administrator",
    },
  });

  // Assign all permissions to admin role
  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  console.log("  ✅ Admin role created with all permissions");

  // ─── 3. Create Viewer Role (read-only) ───────────────
  const viewerRole = await prisma.role.upsert({
    where: { name: "viewer" },
    update: {},
    create: {
      name: "viewer",
      description: "Read-only access",
    },
  });

  const readPermissions = permissions.filter((p) => p.action === "read");
  for (const perm of readPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: viewerRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: viewerRole.id,
        permissionId: perm.id,
      },
    });
  }

  console.log("  ✅ Viewer role created with read permissions");

  // ─── 3b. Create Customer Role (default) ─────────────────────────
const customerRole = await prisma.role.upsert({
  where: { name: "Customer" },
  update: {},
  create: {
    name: "Customer",
    description: "Default customer role",
  },
});

console.log("  ✅ Customer role created");

  // ─── 4. Create Admin User ───────────────────────────
  const hashedPassword = await hash("admin123", 12);

  const adminUser = await prisma.user.upsert({
  where: { email: "admin@power8.dev" },
  update: {
    phone: "+10000000001",
  },
  create: {
    email: "admin@power8.dev",
    phone: "+10000000001",
    password: hashedPassword,
    name: "System Admin",
    isActive: true,
  },
});

  // Assign admin role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log("  ✅ Admin user created (admin@power8.dev / admin123)");

  // ─── 5. Create Demo Viewer User ─────────────────────
const viewerUser = await prisma.user.upsert({
  where: { email: "viewer@power8.dev" },
  update: {
    phone: "+10000000002",
  },
  create: {
    email: "viewer@power8.dev",
    phone: "+10000000002",
    password: await hash("viewer123", 12),
    name: "Demo Viewer",
    isActive: true,
  },
});

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: viewerUser.id,
        roleId: viewerRole.id,
      },
    },
    update: {},
    create: {
      userId: viewerUser.id,
      roleId: viewerRole.id,
    },
  });

  console.log("  ✅ Viewer user created (viewer@power8.dev / viewer123)");

  // ─── 6. Create Companies ─────────────────────────────
  const companiesDefs = [
    {
      name: "SolarMax Energy",
      description: "Leading manufacturer of solar panels and inverters",
      address: "12 Industrial Avenue, Lagos",
      contactNumber: "+2348012345678",
    },
    {
      name: "PowerGrid Solutions",
      description: "Specialist in batteries and energy storage systems",
      address: "45 Tech Park Road, Abuja",
      contactNumber: "+2348023456789",
    },
    {
      name: "GreenVolt Industries",
      description: "Renewable energy equipment supplier",
      address: "78 Commerce Street, Port Harcourt",
      contactNumber: "+2348034567890",
    },
  ];

  const createdCompanies = [];
  let companiesCreated = 0;
  for (const company of companiesDefs) {
    const existing = await prisma.company.findFirst({ where: { name: company.name } });
    const record = existing ?? (await prisma.company.create({ data: company }));
    if (!existing) companiesCreated++;
    createdCompanies.push(record);
  }

  console.log(`  ✅ ${companiesCreated} companies created (skipped ${companiesDefs.length - companiesCreated} existing)`);

  // ─── 7. Create Product Categories ────────────────────
  const categoriesDefs = [
    { name: "Solar Panels", description: "Photovoltaic solar panels", sort: 1 },
    { name: "Inverters", description: "Power inverters for solar systems", sort: 2 },
    { name: "Batteries", description: "Energy storage batteries", sort: 3 },
    { name: "Charge Controllers", description: "Solar charge controllers", sort: 4 },
    { name: "Accessories", description: "Cables, connectors, and mounting equipment", sort: 5 },
  ];

  const createdCategories = [];
  let categoriesCreated = 0;
  for (const category of categoriesDefs) {
    const existing = await prisma.productCategory.findFirst({ where: { name: category.name } });
    const record = existing ?? (await prisma.productCategory.create({ data: category }));
    if (!existing) categoriesCreated++;
    createdCategories.push(record);
  }

  console.log(`  ✅ ${categoriesCreated} product categories created (skipped ${categoriesDefs.length - categoriesCreated} existing)`);

  // ─── 8. Create Products ──────────────────────────────
  const productsDefs = [
    {
      name: "250W Mono Solar Panel",
      description: "High efficiency monocrystalline solar panel, ideal for residential use",
      categoryId: createdCategories[0].id,
      companyId: createdCompanies[0].id,
      price: 45000,
      warranty: 25,
      capacity: 250,
      stockQuantity: 50,
    },
    {
      name: "400W Mono Solar Panel",
      description: "Premium monocrystalline panel for commercial installations",
      categoryId: createdCategories[0].id,
      companyId: createdCompanies[0].id,
      price: 72000,
      warranty: 25,
      capacity: 400,
      stockQuantity: 30,
    },
    {
      name: "550W Bifacial Solar Panel",
      description: "Dual-sided panel capturing reflected light for maximum output",
      categoryId: createdCategories[0].id,
      companyId: createdCompanies[2].id,
      price: 95000,
      warranty: 30,
      capacity: 550,
      stockQuantity: 15,
    },
    {
      name: "3.5KVA Hybrid Inverter",
      description: "Hybrid inverter with MPPT charge controller built-in",
      categoryId: createdCategories[1].id,
      companyId: createdCompanies[0].id,
      price: 185000,
      warranty: 24,
      capacity: 3500,
      stockQuantity: 20,
    },
    {
      name: "5KVA Pure Sine Wave Inverter",
      description: "High capacity inverter for homes and small offices",
      categoryId: createdCategories[1].id,
      companyId: createdCompanies[1].id,
      price: 250000,
      warranty: 24,
      capacity: 5000,
      stockQuantity: 12,
    },
    {
      name: "200Ah Lithium Battery",
      description: "Deep cycle lithium iron phosphate battery, 5000+ cycles",
      categoryId: createdCategories[2].id,
      companyId: createdCompanies[1].id,
      price: 320000,
      warranty: 36,
      capacity: 200,
      stockQuantity: 25,
    },
    {
      name: "100Ah Gel Battery",
      description: "Maintenance-free gel battery for solar systems",
      categoryId: createdCategories[2].id,
      companyId: createdCompanies[1].id,
      price: 85000,
      warranty: 12,
      capacity: 100,
      stockQuantity: 40,
    },
    {
      name: "60A MPPT Charge Controller",
      description: "Maximum power point tracking controller for optimal charging",
      categoryId: createdCategories[3].id,
      companyId: createdCompanies[2].id,
      price: 45000,
      warranty: 24,
      capacity: 60,
      stockQuantity: 35,
    },
    {
      name: "30A PWM Charge Controller",
      description: "Budget-friendly pulse width modulation controller",
      categoryId: createdCategories[3].id,
      companyId: createdCompanies[2].id,
      price: 12000,
      warranty: 12,
      capacity: 30,
      stockQuantity: 60,
    },
    {
      name: "Solar Cable 6mm (100m)",
      description: "UV resistant solar cable, 100 meter roll",
      categoryId: createdCategories[4].id,
      companyId: createdCompanies[2].id,
      price: 25000,
      warranty: 10,
      capacity: 0,
      stockQuantity: 100,
    },
    {
      name: "Panel Mounting Kit",
      description: "Complete roof mounting kit for 4 solar panels",
      categoryId: createdCategories[4].id,
      companyId: createdCompanies[0].id,
      price: 18000,
      warranty: 15,
      capacity: 0,
      stockQuantity: 45,
    },
    {
      name: "400W Mono Solar Panel",
      description: "Premium monocrystalline panel for commercial installations",
      categoryId: createdCategories[0].id,
      companyId: createdCompanies[0].id,
      price: 50000,
      warranty: 25,
      capacity: 300,
      stockQuantity: 0,
    },
  ];

  let productsCreated = 0;
  for (const product of productsDefs) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) continue;
    await prisma.product.create({ data: product });
    productsCreated++;
  }

  console.log(`  ✅ ${productsCreated} products created (skipped ${productsDefs.length - productsCreated} existing)`);

  // ─── 9. Create Carousel Slides ───────────────────────
  const carouselDefs = [
    {
      title: "Professional Installation",
      description: "Expert solar panel installation for your home",
      imageUrl: "/images/power-1.jpg",
      linkUrl: "/products",
      sort: 1,
    },
    {
      title: "Advanced Technology",
      description: "State-of-the-art solar energy systems",
      imageUrl: "/images/power-2.jpg",
      linkUrl: "/products",
      sort: 2,
    },
    {
      title: "Power Your Household",
      description: "Reliable energy for your household",
      imageUrl: "/images/power-7.jpg",
      linkUrl: "/calculator",
      sort: 3,
    },
  ];

  let carouselCreated = 0;
  for (const slide of carouselDefs) {
    const existing = await prisma.carouselSlide.findFirst({ where: { title: slide.title } });
    if (existing) continue;
    await prisma.carouselSlide.create({ data: slide });
    carouselCreated++;
  }

  console.log(`  ✅ ${carouselCreated} carousel slides created (skipped ${carouselDefs.length - carouselCreated} existing)`);

  // ─── 10. Create Blog Categories ──────────────────────
  const blogCategoryDefs = [
    { name: "Solar Tips", description: "Tips and tricks for solar energy", sort: 1 },
    { name: "Industry News", description: "Latest news in the solar industry", sort: 2 },
    { name: "Installation Guides", description: "Step-by-step installation guides", sort: 3 },
    { name: "Product Reviews", description: "Reviews of solar products", sort: 4 },
  ];

  const createdBlogCategories = [];
  let blogCategoriesCreated = 0;
  for (const cat of blogCategoryDefs) {
    const existing = await prisma.blogCategory.findFirst({ where: { name: cat.name } });
    const record = existing ?? (await prisma.blogCategory.create({ data: cat }));
    if (!existing) blogCategoriesCreated++;
    createdBlogCategories.push(record);
  }

  console.log(`  ✅ ${blogCategoriesCreated} blog categories created (skipped ${blogCategoryDefs.length - blogCategoriesCreated} existing)`);

  // ─── 11. Create Blogs ────────────────────────────────
  const blogDefs = [
    {
      title: "How to Size Your Solar Panel System",
      slug: "how-to-size-solar-panel-system",
      excerpt: "Learn the step-by-step process for determining the right solar panel system size for your home or business.",
      content: `Sizing a solar panel system correctly is crucial for getting the most value from your investment. Here's a comprehensive guide:\n\n## Step 1: Calculate Your Daily Energy Usage\nStart by listing all your appliances and their wattage. Multiply each by the number of hours used daily to get watt-hours (Wh).\n\n## Step 2: Account for System Losses\nSolar systems aren't 100% efficient. Factor in about 20-30% losses from inverter conversion, cable resistance, and panel degradation.\n\n## Step 3: Determine Peak Sun Hours\nNigeria averages 4-6 peak sun hours depending on location. Northern states like Sokoto get more sun than coastal cities like Lagos.\n\n## Step 4: Calculate Panel Requirements\nDivide your total daily Wh by peak sun hours, then divide by your chosen panel wattage.\n\n## Step 5: Size Your Battery Bank\nFor off-grid systems, multiply daily usage by days of autonomy, then divide by battery voltage and depth of discharge.\n\nUse our Solar Calculator to automate these calculations!`,
      imageUrl: "/images/power-1.jpg",
      isPublished: true,
      publishedAt: new Date("2026-03-01"),
      categoryId: createdBlogCategories[0].id,
      companyId: createdCompanies[0].id,
      authorId: adminUser.id,
    },
    {
      title: "Top 5 Benefits of Switching to Solar Energy in Nigeria",
      slug: "top-5-benefits-solar-energy-nigeria",
      excerpt: "Discover why thousands of Nigerian homes and businesses are making the switch to solar power.",
      content: `Solar energy is transforming how Nigerians power their homes and businesses. Here are the top 5 benefits:\n\n## 1. Eliminate Generator Costs\nThe average Nigerian household spends ₦50,000-₦150,000 monthly on fuel. Solar eliminates this expense entirely.\n\n## 2. Reliable Power Supply\nUnlike the national grid, solar provides consistent electricity. With battery storage, you have power even at night.\n\n## 3. Environmental Impact\nEach solar installation reduces carbon emissions by approximately 1.5 tons per year.\n\n## 4. Increased Property Value\nHomes with solar installations see a 10-15% increase in property value.\n\n## 5. Low Maintenance\nSolar panels require minimal maintenance — just occasional cleaning and annual inspections.\n\nReady to make the switch? Browse our product catalog to find the perfect system.`,
      imageUrl: "/images/power-2.jpg",
      isPublished: true,
      publishedAt: new Date("2026-03-10"),
      categoryId: createdBlogCategories[1].id,
      authorId: adminUser.id,
    },
    {
      title: "Understanding Solar Inverters: Pure Sine vs Modified Sine",
      slug: "understanding-solar-inverters",
      excerpt: "A complete comparison of pure sine wave and modified sine wave inverters for solar systems.",
      content: `Choosing the right inverter is one of the most important decisions when setting up a solar system.\n\n## Pure Sine Wave Inverters\n- Produce clean, smooth electrical output identical to grid power\n- Safe for all appliances including sensitive electronics\n- Higher efficiency (90-95%)\n- More expensive but worth the investment\n\n## Modified Sine Wave Inverters\n- Produce a stepped approximation of a sine wave\n- Suitable for basic appliances like lights and fans\n- Can damage sensitive electronics over time\n- More affordable but limited compatibility\n\n## Our Recommendation\nFor Nigerian homes and businesses, we always recommend pure sine wave inverters. The slightly higher cost pays for itself in appliance protection and energy efficiency.\n\nCheck out our inverter collection to find the right one for your needs.`,
      imageUrl: "/images/power-7.jpg",
      isPublished: true,
      publishedAt: new Date("2026-03-15"),
      categoryId: createdBlogCategories[3].id,
      companyId: createdCompanies[1].id,
      authorId: adminUser.id,
    },
    {
      title: "Step-by-Step: Installing Solar Panels on Your Roof",
      slug: "step-by-step-installing-solar-panels",
      excerpt: "A beginner-friendly guide to understanding the solar panel installation process.",
      content: `While professional installation is recommended, understanding the process helps you make informed decisions.\n\n## Planning Phase\n1. Assess your roof condition and orientation\n2. Check for shading from trees or buildings\n3. Obtain necessary permits from local authorities\n\n## Installation Steps\n1. Install mounting rails on the roof\n2. Secure solar panels to the mounting system\n3. Wire panels in series or parallel configuration\n4. Connect to charge controller\n5. Connect batteries\n6. Connect inverter\n7. Test the entire system\n\n## Safety Considerations\n- Always work with a certified electrician\n- Use proper safety gear when working on roofs\n- Ensure all connections are weatherproofed\n\n## Post-Installation\n- Register your system for monitoring\n- Schedule annual maintenance checks\n- Keep panels clean for optimal performance\n\nNeed professional installation? Contact our partner companies for a quote.`,
      imageUrl: "/images/power-1.jpg",
      isPublished: true,
      publishedAt: new Date("2026-03-20"),
      categoryId: createdBlogCategories[2].id,
      companyId: createdCompanies[2].id,
      authorId: adminUser.id,
    },
    {
      title: "Battery Technology: Lithium vs GEL vs Lead Acid",
      slug: "battery-technology-comparison",
      excerpt: "Compare the three main battery types used in solar energy storage systems.",
      content: `Choosing the right battery technology can significantly impact your solar system's performance and total cost of ownership.\n\n## Lithium Iron Phosphate (LiFePO4)\n- 5,000+ charge cycles\n- 95% depth of discharge\n- Lightweight and compact\n- Higher upfront cost but lowest cost per cycle\n- 10+ year lifespan\n\n## GEL Batteries\n- 1,200-1,500 charge cycles\n- 50% recommended depth of discharge\n- Maintenance-free\n- Good for moderate budgets\n- 3-5 year lifespan\n\n## Lead Acid (Flooded)\n- 500-1,000 charge cycles\n- 50% depth of discharge\n- Requires regular maintenance\n- Lowest upfront cost\n- 2-4 year lifespan\n\n## The Verdict\nFor long-term value, lithium batteries are the clear winner despite the higher initial cost. For budget-conscious buyers, GEL batteries offer a good middle ground.\n\nExplore our battery selection to find the right fit for your budget and needs.`,
      imageUrl: "/images/power-2.jpg",
      isPublished: true,
      publishedAt: new Date("2026-03-25"),
      categoryId: createdBlogCategories[3].id,
      companyId: createdCompanies[1].id,
      authorId: adminUser.id,
    },
    {
      title: "Upcoming: Solar Incentives and Government Programs",
      slug: "upcoming-solar-incentives",
      excerpt: "Preview of upcoming government solar incentive programs for Nigerian households.",
      content: `Stay tuned for exciting updates on government programs designed to make solar energy more accessible...\n\nThis article is currently being prepared and will be published soon.`,
      imageUrl: "/images/power-7.jpg",
      isPublished: false,
      categoryId: createdBlogCategories[1].id,
      authorId: adminUser.id,
    },
  ];

  let blogsCreated = 0;
  for (const blog of blogDefs) {
    const existing = await prisma.blog.findFirst({ where: { slug: blog.slug } });
    if (existing) continue;
    await prisma.blog.create({ data: blog });
    blogsCreated++;
  }

  console.log(`  ✅ ${blogsCreated} blogs created (skipped ${blogDefs.length - blogsCreated} existing)`);

  // ─── 12. Create Testimonials ────────────────────────────────
  const customerUser = await prisma.user.upsert({
    where: { email: "customer@power8.dev" },
    update: {},
    create: {
      email: "customer@power8.dev",
      phone: "+234800000000",
      password: await hash("customer123", 12),
      name: "Demo Customer",
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: customerUser.id,
        roleId: customerRole.id,
      },
    },
    update: {},
    create: {
      userId: customerUser.id,
      roleId: customerRole.id,
    },
  });

  console.log("  ✅ Demo customer user created (customer@power8.dev / customer123)");

  const testimonialDefs = [
  {
    title: "Adeola Ogunlesi",
    description: "Since installing Power-8, my electricity bills have dropped by 80%. The pay-small-small option made it affordable. Best investment I've made for my home!",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    userId: customerUser.id,
  },
  {
    title: "Chidi Okonkwo",
    description: "No more generator noise or fuel costs. My family enjoys 24/7 power and the installation was seamless. Highly recommend Power-8!",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    userId: customerUser.id,
  },
  {
    title: "Fatima Abubakar",
    description: "The credit plan made it affordable. I'm saving money every month while helping the environment. Customer service is exceptional!",
    rating: 4,
    imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    userId: customerUser.id,
  },
  {
    title: "Oluwaseun Adeyemi",
    description: "Power-8 transformed my small business. No more power outages affecting my work. The installation team was professional and efficient.",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/men/4.jpg",
    userId: customerUser.id,
  },
  {
    title: "Ngozi Eze",
    description: "Finally, reliable power! The system works perfectly and the app makes it easy to monitor my usage. Worth every naira.",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/women/5.jpg",
    userId: customerUser.id,
  },
  {
    title: "Ibrahim Musa",
    description: "Best decision I made. My generator hasn't run in 6 months. The savings have already paid for half the system.",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/men/6.jpg",
    userId: customerUser.id,
  },
];

  for (const testimonial of testimonialDefs) {
    await prisma.testimonial.create({ data: testimonial });
  }

  console.log(`  ✅ ${testimonialDefs.length} testimonials created`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });