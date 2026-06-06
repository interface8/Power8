import { Blog } from "@/types/admin-blog";

export const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "10 Benefits of Solar Energy for Ghanaian Homes",
    slug: "10-benefits-of-solar-energy",
    category: "Education",
    author: "Admin",
    status: "published",
    createdAt: "Sep 10, 2024",
    updatedAt: "Sep 12, 2024",
  },
  {
    id: "2",
    title: "How to Choose the Right Solar System Size",
    slug:  "how-to-choose-the-right-solar-system-size",
    category: "Guides",
    author: "Kwabena Adu",
    status: "published",
    createdAt: "Sep 5, 2024",
    updatedAt: "Sep 08, 2024",
  },
  {
    id: "3",
    title: "Government Solar Subsidies",
    slug: "government-solar-subsidies",
    category: "News",
    author: "Admin",
    status: "draft",
    createdAt: "Sep 1, 2024",
    updatedAt: "Sep 05, 2024",
  },
  {
    id: "4",
    title: "Understanding MPPT vs PWM Controllers",
    slug: "understanding-mppt-vs-pwm-controllers",
    category: "Education",
    author: "Kwabena Adu",
    status: "published",
    createdAt: "Aug 28, 2024",
    updatedAt: "Sep 01, 2024",
  },
];
