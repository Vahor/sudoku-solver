import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useEffect } from "react";
import { Grid } from "../components/Grid";
import toast from "react-hot-toast";
import { difficulties, Difficulty, generateEmptySquares, Sudoku, sleep } from "../utils/sudoku";
import { Vahor } from "../components/Vahor";
import { Menu } from "../components/Menu";
import { Button } from "../components/Button";
import confetti from 'canvas-confetti';
import { Timer } from "../components/Timer";

import { event } from "nextjs-google-analytics";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { ThemedToaster } from "../components/ThemedToaster";



const meta = {
  title: "Sudoku - Vahor",
  description: "Play unlimited sudoku games, generate new puzzles whenever you want, and solve them with hints. This is one the many projects of Vahor.",
  image: "https://sudoku.vahor.fr/banner.png",
  url: "https://sudoku.vahor.fr",
  twitterUsername: "@Vahor_",
}

const EMPTY_ARRAY: any[] = [];


const Home: NextPage = () => {
  const sudoku = React.useMemo(() => new Sudoku(generateEmptySquares()), []);
  const [squares, setSquares] = React.useState<number[][]>(() => sudoku.getSquares());
  const [initial, setInitial] = React.useState<[number, number][]>(() => []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const errors = React.useMemo<[number, number][]>(() => sudoku.getErrorsPositions(), [sudoku, squares]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [animate, setAnimate] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [showErrors, setShowErrors] = React.useState<boolean>(true);
  const [startedAt, setStartedAt] = React.useState<number>(0);


  const checkSuccess = useCallback(async () => {
    if (success) return;
    if (!sudoku.getRandomEmptySquare()) {
      if (errors.length !== 0) {
        toast.error("There are errors in the puzzle");
        return;
      }

      setLoading(true);
      setSuccess(true);

      if(document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }

      confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: 0.5,
          // since they fall down, start a bit higher than random
          y: 0.5 - Math.random() * 0.3,
        }
      });

      await sleep(2000);

      setLoading(false);

      const timer = Date.now() - startedAt;
      event("success", {
        category: "sudoku",
        value: timer,
      });

    }
  }, [sudoku, errors, startedAt, success]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess, errors]);

  const checkStart = useCallback(async (force: boolean = false) => {
    if (force || startedAt === 0) {
      setStartedAt(Date.now());
      event("start", {
        category: "sudoku",
      });
    }
  }
    , [startedAt]);



  const updateSquare = useCallback((i: number, j: number, value: number, withSudoku: boolean = true) => {
    if (!value)
      value = 0;
    checkStart();
    setSquares(squares => {
      const newSquares = squares.map(row => [...row]);
      newSquares[i]![j] = value;
      if (withSudoku) {
        sudoku.setSquares(newSquares);
      }
      return newSquares;
    });
  }, [sudoku, checkStart]);

  const updateSquareAnimation = useCallback((i: number, j: number, value: number) => updateSquare(i, j, value, false), [updateSquare]);

  const reset = () => {
    setLoading(true);
    const newSquares = generateEmptySquares(9);
    setSquares(() => newSquares);
    setInitial([]);
    sudoku.setSquares(newSquares);
    setStartedAt(0);
    setLoading(false);
    setSuccess(false);
  }

  const solve = async () => {
    if (loading || success) return;
    if (errors.length !== 0) {
      toast.error("There are errors in the puzzle");
      return;
    }

    const loadingToast = toast.loading("Solving...");
    checkStart();
    setLoading(true);
    const solution = await sudoku.solve(animate ? updateSquareAnimation : undefined);
    setLoading(false);

    toast.remove(loadingToast);

    if (solution) {
      setSquares(() => solution.map(row => [...row]));
      toast.success("Solved!");
    } else {
      toast.error("No solution found");
    }
  }

  const hint = useCallback(async () => {
    if (loading || success) return;
    if (errors.length !== 0) {
      toast.error("There are errors in the puzzle");
      return;
    }


    const loadingToast = toast.loading("Searching...");

    checkStart();
    setLoading(true);
    await sleep(150);

    try {
      const [i, j, value] = await sudoku.fillOneSquare();
      setInitial((initial) => [...initial, [i, j]]);
      updateSquare(i, j, value, false);
      toast.remove(loadingToast);
      toast.success("Found!");
    } catch (error) {
      toast.error("No hint found");
    } finally {
      toast.remove(loadingToast);
      setLoading(false);
    }
  }, [loading, sudoku, setInitial, updateSquare, errors, checkStart, success]);

  const generate = async (difficulty: Difficulty) => {
    if (loading) return;

    const loadingToast = toast.loading("Generating...");
    setLoading(true);
    setInitial([]);
    await sleep(300);
    await sudoku.generate(difficulty).then(() => {
      setSquares(() => sudoku.getSquares().map(row => [...row]));
      const newInitial: [number, number][] = [];
      sudoku.getSquares().forEach((row, i) => {
        row.forEach((value, j) => {
          if (value) {
            newInitial.push([i, j]);
          }
        });
      }
      );
      setInitial(newInitial);
      toast.success("Generated!");
      checkStart(true);
    })
      .catch(() => {
        toast.error("Error generating");
      }).then(() => {
        setSuccess(false);
        setLoading(false);
        toast.remove(loadingToast);
      });
  }

  useEffect(() => {
    // On keyboard click 'H', run hint
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "h") {
        hint();
        e.preventDefault();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [hint]);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="theme-color" content="#0e1219" />
        <meta name="color-scheme" content="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />


        {/* Twitter */}
        <meta property="twitter:site" content={meta.twitterUsername} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={meta.title} />
        <meta property="twitter:description" content={meta.description} />
        <meta property="twitter:image" content={meta.image} />

        {/* Og */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.url} />
        <meta property="og:image" content={meta.image} />

        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={meta.title} />

        {/* Windows */}
        <meta name="msapplication-TileColor" content="#0e1219" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="application-name" content={meta.title} />
        <meta name="msapplication-tooltip" content={meta.description} />

        {/* Android */}
        <meta name="mobile-web-app-capable" content="yes" />


      </Head>


      <ThemeProvider attribute="class" defaultTheme="dark">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-neutral-800 dark:text-pink-200 text-4xl md:text-5xl font-bold text-center fade-1">
            {success ? "Congratulations!" : "Sudoku"}
          </h1>
          <div className="text-neutral-700 dark:text-pink-50 fade-2">
            <Timer startedAt={startedAt} running={!success} />
          </div>

          <div className={`mt-4 md:mt-8 ${(loading || success) ? "pointer-events-none" : ""}`}>
            <Grid
              squares={squares}
              updateSquare={updateSquare}
              sudoku={sudoku}
              initial={initial}
              errors={showErrors ? errors : EMPTY_ARRAY}
            />
          </div>

          <div className="mt-4 flex gap-4 fade-2">

            <Button
              onClick={reset}
              disabled={loading}
            >
              Reset
            </Button>


            <Button onClick={solve}
              disabled={loading || success}
            >
              Solve
            </Button>

            <Button onClick={hint}
              disabled={loading || success}
            >
              <u>H</u>int
            </Button>

            <Menu label="Generate"
              disabled={loading}>
              {(close) =>
                <ul>
                  {Object.keys(difficulties).map((difficulty) => {
                    return (
                      <li
                        key={difficulty}
                        className="p-2 text-white outline-none cursor-pointer hover:bg-secondary-700 capitalize"
                        onClick={() => {
                          close();
                          generate(difficulty as Difficulty);
                        }}
                      >
                        {difficulty}
                      </li>
                    )
                  })}
                </ul>
              }
            </Menu>
          </div>

          <div className="mt-4 fade-3 flex justify-center gap-4">
            <label className={`flex items-center relative mb-4 ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
              <input type="checkbox" className="sr-only"
                checked={animate}
                disabled={loading}
                onChange={(e) => setAnimate(e.target.checked)}
              />
              <div className="toggle-bg bg-gray-700 dark:bg-gray-200 border-2 border-gray-700 dark:border-gray-200 h-6 w-11 rounded-full"></div>
              <span className="ml-2 md:ml-3 text-neutral-700 dark:text-pink-300 text-sm font-medium">Animate</span>
            </label>

            <label className={`flex items-center relative mb-4 ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
              <input type="checkbox" className="sr-only"
                checked={showErrors}
                disabled={loading}
                onChange={(e) => setShowErrors(e.target.checked)}
              />
              <div className="toggle-bg bg-gray-700 dark:bg-gray-200 border-2 border-gray-700 dark:border-gray-200 h-6 w-11 rounded-full"></div>
              <span className="ml-2 md:ml-3 text-neutral-700 dark:text-pink-300 text-sm font-medium">Show Errors</span>
            </label>

            <ThemeSwitcher />

          </div>

          {/* <pre className="text-center text-gray-500 text-xs mt-4">
          {sudoku.getSquares().map((row, i) => {
            return row.map((value, j) => {
              return value ? value : ".";
            }
            ).join(" ");
          }
          ).join("\n")}
        </pre> */}

          
          <Vahor />
          <ThemedToaster />

        </div>
      </ThemeProvider>



    </>
  );
};

export default Home;
