# Hashira Secret Reconstruction

This project solves the **Hashira Placements Assignment** problem: reconstructing a secret using Shamir's Secret Sharing scheme.

## 📖 Problem
We are given several shares of a secret, each share consisting of an x-coordinate and a y-value expressed in various bases (binary, octal, decimal, hexadecimal, etc.). Using any **k** shares, we reconstruct the secret polynomial and evaluate it at `x = 0` to get the hidden secret.

## ⚙️ Solution Approach
- Implemented in **Node.js** using **BigInt** for precise large integer calculations.
- Converts share values from their given base into integers.
- Uses **Lagrange interpolation** to reconstruct the polynomial at `x = 0`.
- Prints the recovered secret.

## 📂 Files
- `solve.js` → Main solver script.
- `testcase_real.json` → Provided real testcase input.
- `testcase_sanity.json` → Simple sample testcase for validation.
- `testcase_big.json` → Another big-number testcase for testing.

## ▶️ How to Run
1. Install Node.js (LTS version recommended).
2. Clone this repository and navigate to the folder.
3. Run with a testcase file, for example:

```bash
node solve.js testcase_real.json
