import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import { Grid } from "../components/Grid";
import toast, { Toaster } from "react-hot-toast";
import { size } from "../utils/sudoku";
import { Vahor } from "../components/Vahor";
import { Remote, wrap } from "comlink";
import { SudokuApi } from "../workers/sudoku.worker";
import { maxDelay } from "../utils/maxDelay";

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
  const sudokuWorkerRef = React.useRef<Worker>();
  const sudokuWorkerApiRef = React.useRef<Remote<SudokuApi>>();

  useEffect(() => {
    sudokuWorkerRef.current = new Worker(new URL('../workers/sudoku.worker', import.meta.url), {
      type: "module",
    })
    sudokuWorkerApiRef.current = wrap<SudokuApi>(
      sudokuWorkerRef.current
    );

    return () => {
      sudokuWorkerRef.current?.terminate();
    }
  }, [])

  const [squares, setSquares] = React.useState<number[][]>(() => Array(size).fill(Array(size).fill(null)));

  const updateSquare = (i: number, j: number, value: number) => {
    setSquares(squares => {
      const newSquares = squares.map(row => [...row]);
      newSquares[i]![j] = value;
      return newSquares;
    });
  }

  const solve = async () => {
    const loadingToast = toast.loading("Solving...", toastProps);
    if (!sudokuWorkerApiRef.current) {
      toast.error("Failed to solve", toastProps);
      return;
    }

    const solution = await maxDelay(sudokuWorkerApiRef.current.solveSudoku(squares), 1000, () => {
      toast.remove(loadingToast);
      toast.error("No solution found in time", toastProps);
    });

    toast.remove(loadingToast);

    if (solution) {
      setSquares(solution);
      toast.success("Solved!", toastProps);
    } else {
      toast.error("No solution found", toastProps);
    }
  }

  return (
    <>
      <Head>
        <title>Sudoku Solver - Vahor</title>
        <meta name="description" content="Sudoku solver by Vahor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-pink-200 text-5xl font-bold text-center fade-1">
          Sudoku Solver
        </h1>

        <div className="mt-4">
          <Grid
            squares={squares}
            updateSquare={updateSquare}
          />
        </div>

        <div className="mt-4 flex gap-4 fade-2">

          <button
            className="bg-neutral-800 hover:bg-neutral-700 border p-2 text-white outline-none border-neutral-600 rounded-md"
            onClick={() => setSquares(() => Array(size).fill(Array(size).fill(null)))}
          >
            Reset
          </button>


          <button
            className="bg-neutral-800 hover:bg-neutral-700 border p-2 text-white outline-none border-neutral-600 rounded-md"
            onClick={solve}
          >
            Solve
          </button>

        </div>

        <Toaster />
        <Vahor />

      </div>



    </>
  );
};

export default Home;
