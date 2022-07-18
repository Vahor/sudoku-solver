import React from 'react'

export interface TimerProps {
    running: boolean;
    startedAt: number; // Date.now()
}

export const Timer = ({running,startedAt}: TimerProps) => {
    
    const [time, setTime] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if(!startedAt || !running) return;
            setTime(Date.now() - startedAt);
        }, 1000);
        return () => {
            clearInterval(interval);
            if(!startedAt) 
                setTime(0);
        }
    }, [running, startedAt]);

    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Show DD:HH:MM:SS

    const format = (n: number) => {
        return n < 10 ? `0${n}` : n.toString();
    }

    console.log(startedAt);
    console.log(time);

    if  (startedAt === 0) {
        return <div className="text-center">
            <span className="text-2xl font-bold">00:00</span>
        </div>
    }
    return <div className="text-center">
            <span className="text-2xl font-bold">{`${days > 0 ? `${format(days)}:` : ''}${hours > 0 ? `${format(hours)}:` : ''}${format(minutes % 60)}:${format(seconds % 60)}`}</span>
        </div>

}