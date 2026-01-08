import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import ScrollToTop from "./ScrollToTop";
import { ExploreSkeleton, LibrarySkeleton, BookDetailSkeleton } from "./PageSkeletons";
import Index from "@/pages/Index";
import Explore from "@/pages/Explore";
import Publish from "@/pages/Publish";
import Auth from "@/pages/Auth";
import BookDetail from "@/pages/BookDetail";
import Read from "@/pages/Read";
import Library from "@/pages/Library";
import NotFound from "@/pages/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/explore"
          element={
            <PageTransition skeleton={<ExploreSkeleton />}>
              <Explore />
            </PageTransition>
          }
        />
        <Route
          path="/publish"
          element={
            <PageTransition>
              <Publish />
            </PageTransition>
          }
        />
        <Route
          path="/auth"
          element={
            <PageTransition>
              <Auth />
            </PageTransition>
          }
        />
        <Route
          path="/book/:id"
          element={
            <PageTransition skeleton={<BookDetailSkeleton />}>
              <BookDetail />
            </PageTransition>
          }
        />
        <Route
          path="/read/:id"
          element={
            <PageTransition>
              <Read />
            </PageTransition>
          }
        />
        <Route
          path="/library"
          element={
            <PageTransition skeleton={<LibrarySkeleton />}>
              <Library />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default AnimatedRoutes;
