import { createWebHistory, createRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

// Import components for public access
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import BookList from "@/views/BookList.vue";
import BookDetails from "@/views/BookDetails.vue";
import NotFound from "@/views/NotFound.vue";

// Import components for authenticated users
import UserDashboard from "@/views/user/Dashboard.vue";
import UserBorrowHistory from "@/views/user/BorrowHistory.vue";
import BorrowRequest from "@/views/user/BorrowRequest.vue";

// Import components for admin
import AdminDashboard from "@/views/admin/Dashboard.vue";
import AdminBooks from "@/views/admin/Books.vue";
import AdminBookForm from "@/views/admin/BookForm.vue";
import AdminPublishers from "@/views/admin/Publishers.vue";
import AdminPublisherForm from "@/views/admin/PublisherForm.vue";
import AdminBorrowRequests from "@/views/admin/BorrowRequests.vue";
import AdminUsers from "@/views/admin/Users.vue";

const routes = [
  // Public routes
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/books",
    name: "books",
    component: BookList,
  },
  {
    path: "/books/:id",
    name: "book-details",
    component: BookDetails,
    props: true,
  },

  // User routes
  {
    path: "/user",
    name: "user-dashboard",
    component: UserDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/borrow-history",
    name: "user-borrow-history",
    component: UserBorrowHistory,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/borrow-request/:id",
    name: "borrow-request",
    component: BorrowRequest,
    props: true,
    meta: { requiresAuth: true },
  },

  // Admin routes
  {
    path: "/admin",
    name: "admin-dashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/books",
    name: "admin-books",
    component: AdminBooks,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/books/add",
    name: "admin-book-add",
    component: AdminBookForm,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/books/edit/:id",
    name: "admin-book-edit",
    component: AdminBookForm,
    props: true,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/publishers",
    name: "admin-publishers",
    component: AdminPublishers,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/publishers/add",
    name: "admin-publisher-add",
    component: AdminPublisherForm,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/publishers/edit/:id",
    name: "admin-publisher-edit",
    component: AdminPublisherForm,
    props: true,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/borrow-requests",
    name: "admin-borrow-requests",
    component: AdminBorrowRequests,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/users",
    name: "admin-users",
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // Not Found route
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Sử dụng useAuth trong navigation guard
const { isLoggedIn, isAdmin } = useAuth();

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (to.meta.requiresAdmin && !isAdmin.value) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
