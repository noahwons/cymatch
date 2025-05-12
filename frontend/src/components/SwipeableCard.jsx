import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

export default function SwipeableCard({ card, onSwipe }) {
    const x = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 30 });
    const rotate = useTransform(springX, v => v / 20);

    const bind = useDrag(({ down, movement: [mx], direction: [dx] }) => {
        x.set(down ? mx : 0);
        if (!down && Math.abs(mx) > 150) {
            onSwipe(dx > 0 ? 'right' : 'left', card.id);
        }
    });

    return (
        <motion.div
            {...bind()}
            style={{
                x: springX,
                rotate,
                backgroundImage: `url(${card.img})`,
            }}
            className="
        w-72 h-96                   /* 288×384px card */
        bg-cover bg-center
        rounded-xl shadow-lg
        flex items-end p-4
      "
        >
            <h3 className="text-lg font-semibold text-white drop-shadow">
                {card.name}
            </h3>
        </motion.div>
    );
}
