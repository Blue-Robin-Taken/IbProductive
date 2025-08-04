'use client';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { animate } from 'motion';

export default function Pomodoro() {
  const [play, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [reset, setReset] = useState(0);

  const [currentCycle, setCurrentCycle] = useState<string>('Work Time');

  const [colorsTime, setColorsTime] = useState<number[]>();

  const minuteWorkRef = useRef(null);
  const secondWorkRef = useRef(null);
  const hourWorkRef = useRef(null);

  const minuteBreakRef = useRef(null);
  const secondBreakRef = useRef(null);
  const hourBreakRef = useRef(null);

  // At top of your file:
  type ColorHex = `#${string}`;

  const colorsList: [ColorHex, ColorHex, ...ColorHex[]] = [
    '#00274D', // IB navy (index 0)
    '#093E5E', // teal-navy (index 1)
    '#12556F',
    '#1B6C80',
    '#248391',
    '#2D9AA2',
    '#E6B800',
    '#F6BE00',
    '#FFCA28',
    '#FFD54F',
    '#FFE082',
    '#FF8C00',
    '#FF6F00',
    '#FF5722',
    '#F4511E',
    '#E64A19',
    '#C8102E',
    '#B71C1C',
    '#A31515',
    '#900C3F',
    '#7B0828',
    '#660000',
    '#5C0A0A', // dark red (last)
  ];

  function startWorkTime() {
    if (hourWorkRef.current && secondWorkRef.current && minuteWorkRef.current) {
      const totalTime =
        Number((hourWorkRef.current! as HTMLInputElement).value) * 60 * 60 +
        Number((secondWorkRef.current! as HTMLInputElement).value) +
        Number((minuteWorkRef.current! as HTMLInputElement).value) * 60; // in seconds
      setReset(reset + 1);
      setDuration(totalTime);
      setPlaying(true);
    }
  }

  function startBreakTime() {
    if (
      hourBreakRef.current &&
      secondBreakRef.current &&
      minuteBreakRef.current
    ) {
      const totalTime =
        Number((hourBreakRef.current! as HTMLInputElement).value) * 60 * 60 +
        Number((secondBreakRef.current! as HTMLInputElement).value) +
        Number((minuteBreakRef.current! as HTMLInputElement).value) * 60; // in seconds
      setReset(reset + 1);
      setDuration(totalTime);
      setPlaying(true);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl font-bold text-center">Pomodoro Timer</h1>
      <div className="flex flex-col text-white m-auto p-10 items-center">
        {/* The timer component */}
        <div id="mainClock">
          <CountdownCircleTimer
            onComplete={() => {
              // Refresh anim
              animate(
                document.getElementById('mainClock') as HTMLDivElement,
                {
                  rotate: 360,
                },
                { duration: 0.5 }
              ).then(() => {
                animate(
                  document.getElementById('mainClock') as HTMLDivElement,
                  {
                    rotate: 0,
                  },
                  { duration: 0 }
                );
              });

              // restart
              if (currentCycle == 'Work Time') {
                startBreakTime();
                return setCurrentCycle('Break Time');
              } else {
                startWorkTime();
                return setCurrentCycle('Work Time');
              }
            }}
            key={reset}
            isPlaying={play}
            duration={duration}
            colors={colorsList}
            colorsTime={
              [
                ...colorsList.map((_, i) => {
                  // start at full duration (i=0), down to 0 (i=22)
                  return (duration - (duration * i) / 23) as number;
                }),
              ] as any
            }
            strokeLinecap="butt"
            strokeWidth={8}
            trailColor="#000000"
            size={300}
          >
            {({ remainingTime }) => (
              <div className="text-center font-bold flex flex-col space-y-2 text-xl">
                <p>{currentCycle}:</p>
                <p>{remainingTime}</p>
              </div>
            )}
          </CountdownCircleTimer>
        </div>
        <div className="grid grid-rows-2 grid-cols-1 space-y-2 mt-4">
          <button
            onClick={() => {
              if (currentCycle == 'Work Time') {
                startWorkTime();
              } else if (currentCycle == 'Break Time') {
                if (
                  hourBreakRef.current &&
                  secondBreakRef.current &&
                  minuteBreakRef.current
                ) {
                  startBreakTime();
                }
              }
            }}
            className="bg-slate-800 rounded-xl px-4 p-2 m-auto"
          >
            Start Timer
          </button>
          <button
            onClick={() => {
              if (play) {
                setPlaying(false);
              } else {
                setPlaying(true);
              }
            }}
            className="bg-slate-800 rounded-xl px-4 p-2 m-auto"
          >
            Pause/Play Timer
          </button>
        </div>
        <div className="flex flex-col space-y-4 m-auto mt-4 ml-16">
          <div className="flex flex-col">
            <div className="flex flex-row items-center m-4">
              <h2 className="text-3xl font-semibold">Work Time</h2>
              <div className="flex flex-row space-x-4 ml-auto px-16">
                <div className="flex flex-row items-center font-bold m-auto">
                  <label htmlFor="hours" className="p-2">
                    Hours
                  </label>
                  <input
                    min={0}
                    defaultValue={0}
                    ref={hourWorkRef}
                    id="hours"
                    name="hours"
                    type="number"
                    className="max-w-20 max-h-10 p-2 bg-slate-800 rounded-sm text-white ml-auto"
                  />
                </div>
                <div className="flex flex-row items-center font-bold">
                  <label htmlFor="minutes" className="p-2">
                    Minutes
                  </label>
                  <input
                    min={0}
                    defaultValue={0}
                    ref={minuteWorkRef}
                    id="minutes"
                    name="minutes"
                    type="number"
                    className="max-w-20 max-h-10 p-2 bg-slate-800 rounded-sm text-white ml-auto"
                  />
                </div>
                <div className="flex flex-row items-center font-bold ">
                  <label htmlFor="seconds" className="p-2">
                    Seconds
                  </label>
                  <input
                    min={0}
                    defaultValue={0}
                    ref={secondWorkRef}
                    id="seconds"
                    name="seconds"
                    type="number"
                    className="max-w-20 max-h-10 p-2 bg-slate-800 rounded-sm text-white ml-auto"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center m-4">
              <h2 className="text-3xl font-semibold">Break Time</h2>
              <div className="flex flex-row space-x-4 ml-auto px-16">
                <div className="flex flex-row items-center font-bold">
                  <label htmlFor="hours" className="p-2">
                    Hours
                  </label>
                  <input
                    min={0}
                    defaultValue={0}
                    ref={hourBreakRef}
                    id="hours"
                    name="hours"
                    type="number"
                    className="max-w-20 max-h-10 p-2 bg-slate-800 rounded-sm text-white ml-auto"
                  />
                </div>
                <div className="flex flex-row items-center font-bold ">
                  <label htmlFor="minutes" className="p-2">
                    Minutes
                  </label>
                  <input
                    min={0}
                    defaultValue={0}
                    ref={minuteBreakRef}
                    id="minutes"
                    name="minutes"
                    type="number"
                    className="max-w-20 max-h-10 p-2 bg-slate-800 rounded-sm text-white ml-auto"
                  />
                </div>
                <div className="flex flex-row items-center font-bold ">
                  <label htmlFor="seconds" className="p-2">
                    Seconds
                  </label>
                  <input
                    min={0}
                    defaultValue={0}
                    ref={secondBreakRef}
                    id="seconds"
                    name="seconds"
                    type="number"
                    className="max-w-20 max-h-10 p-2 bg-slate-800 rounded-sm text-white ml-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
