import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectBusPoint } from '../../../sharedSlices/BusOnMapSlice';

export function Maps() {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const points = useAppSelector(selectBusPoint).coordinates;

    useEffect(() => {
        const canvas = canvasRef.current as any;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.src = 'http://localhost:3080/static/pictures/maps.png';

        img.onload = (e) => {
            ctx.drawImage(img, 10, 10);

            const degToRad = (degrees: number) => (Math.PI / 180) * degrees;

            points.forEach(bus => {
                ctx.beginPath();
                ctx.arc(img.width * bus.x, img.height * bus.y, 5, degToRad(0), degToRad(360), true);
                ctx.fill();
            });
        };

        ctxRef.current = ctx;
    }, [points]);

    return (
        <div style={{ marginLeft: '30%' }}>
            <canvas
                ref={canvasRef}
            />
        </div>
    );
}