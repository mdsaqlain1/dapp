import * as React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export default function SolBalance() {
  const [balance, setBalance] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const fetchBalance = async () => {
    if (!publicKey) {
      setBalance(null);
      toast.error("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    try {
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
      toast.success("Balance fetched successfully.");
      console.log("Balance:", solBalance);
    } catch (error) {
      toast.error("Failed to fetch balance.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-5 px-4">
      <Card className="w-4xl max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Solana Balance</CardTitle>
          <CardDescription className="font-semibold">
            Balance on Devnet
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col space-y-2">
            <Label className="text-[1.2rem] font-bold">Current Balance</Label>
            <Input
              type="text"
              value={balance !== null ? `◎ ${balance.toFixed(4)} SOL` : "Not fetched"}
              disabled
              className="font-semibold"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full p-5 bg-[#512da8] hover:cursor-pointer mt-1"
            onClick={fetchBalance}
          >
            {loading ? <Spinner /> : "Refresh Balance"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
