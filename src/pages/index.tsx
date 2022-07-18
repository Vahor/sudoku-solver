import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useEffect } from "react";
import { Grid } from "../components/Grid";
import toast, { Toaster } from "react-hot-toast";
import { difficulties, Difficulty, generateEmptySquares, Sudoku, sleep } from "../utils/sudoku";
import { Vahor } from "../components/Vahor";
import { Menu } from "../components/Menu";
import { Button } from "../components/Button";

const toastProps = {
  style: {
    background: "#262626", // neutral-400
    color: "#FACEE7", // pink-200
  },
  iconTheme: {
    primary: "#FACEE7",
    secondary: "#262626",
  },
}


const Home: NextPage = () => {
  const sudoku = React.useMemo(() => new Sudoku(generateEmptySquares()), []);
  const [squares, setSquares] = React.useState<number[][]>(() => sudoku.getSquares());
  const [initial, setInitial] = React.useState<[number, number][]>(() => []);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [animate, setAnimate] = React.useState<boolean>(false);

  const updateSquare = useCallback((i: number, j: number, value: number, withSudoku: boolean = true) => {
    if (!value)
      value = 0;
    setSquares(squares => {
      const newSquares = squares.map(row => [...row]);
      newSquares[i]![j] = value;
      if (withSudoku) {
        sudoku.setSquares(newSquares);
      }
      return newSquares;
    });
  }, [sudoku]);

  const updateSquareAnimation = useCallback((i: number, j: number, value: number) => updateSquare(i, j, value, false), [updateSquare]);

  const reset = () => {
    setLoading(true);
    const newSquares = generateEmptySquares(9);
    setSquares(() => newSquares);
    setInitial([]);
    sudoku.setSquares(newSquares);
    setLoading(false);
  }

  const solve = async () => {
    if (loading) return;

    const loadingToast = toast.loading("Solving...", toastProps);

    setLoading(true);
    const solution = await sudoku.solve(updateSquareAnimation);
    setLoading(false);

    toast.remove(loadingToast);

    if (solution) {
      setSquares(() => solution.map(row => [...row]));
      toast.success("Solved!", toastProps);
    } else {
      toast.error("No solution found", toastProps);
    }
  }

  const hint = useCallback(async () => {
    if (loading) return;

    const loadingToast = toast.loading("Searching...", toastProps);
    setLoading(true);
    await sleep(250);

    try {
      const [i, j, value] = await sudoku.fillOneSquare();
      setInitial((initial) => [...initial, [i, j]]);
      updateSquare(i, j, value, false);
      toast.remove(loadingToast);
      toast.success("Found!", toastProps);
    } catch (error) {
      toast.error("No hint found", toastProps);
    } finally {
      toast.remove(loadingToast);
      setLoading(false);
    }
  }, [loading, sudoku, setInitial, updateSquare])

  const generate = async (difficulty: Difficulty) => {
    if (loading) return;

    const loadingToast = toast.loading("Generating...", toastProps);
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
      toast.success("Generated!", toastProps);
    })
    .catch(() => {
      toast.remove(loadingToast);
      toast.error("Error generating", toastProps);
    }).then(() => {
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
        <title>Sudoku Solver - Vahor</title>
        <meta name="description" content="Sudoku solver by Vahor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-pink-200 text-4xl md:text-5xl font-bold text-center fade-1">
          Sudoku Solver
        </h1>

        <div className="mt-4">
          <Grid
            squares={squares}
            updateSquare={updateSquare}
            sudoku={sudoku}
            initial={initial}
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
            disabled={loading}
          >
            Solve
          </Button>

          <Button onClick={hint}
            disabled={loading}
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
                      className="p-2 text-white outline-none cursor-pointer hover:bg-neutral-700 capitalize"
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

        <div className="mt-2 fade-3">
          <label className={`flex items-center relative mb-4 ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
            <input type="checkbox" className="sr-only"
              checked={animate}
              disabled={loading}
              onChange={(e) => setAnimate(e.target.checked)}
            />
            <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
            <span className="ml-3 text-pink-300 text-sm font-medium">Animate</span>
          </label>

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

        <Toaster />
        <Vahor />

      </div>



    </>
  );
};

export default Home;
