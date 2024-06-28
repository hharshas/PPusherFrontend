import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

const transition = (OgComponent) => {
  return () => (
    <>
      <div>
        <OgComponent />
      </div>

      <motion.div
        className="slide-in z-40"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: {duration: 1, ease: [0.22, 1, 0.36, 1] } }}
      />
      <motion.div
        className="slide-out z-40"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exist={{ scaleY: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
};

export default transition;