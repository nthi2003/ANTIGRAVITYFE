import { motion } from 'framer-motion';
import mascotImg from '../../assets/mascot.png';

export const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: [0.8, 1.1, 1],
                    opacity: 1,
                    rotate: [0, -5, 5, 0]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="w-48 h-48 relative"
            >
                <img src={mascotImg} alt="Mascot" className="w-full h-full object-contain drop-shadow-2xl" />
                <motion.div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-200 rounded-[100%] blur-md"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
            >
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic">ANTIGRAVITY</h2>
                <div className="flex gap-1.5 justify-center mt-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
