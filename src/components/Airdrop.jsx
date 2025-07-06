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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export default function Airdrop() {
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const handleAmountChange = (value) => {
    setAmount(value);
    console.log(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) {
      toast.error("Please select an amount to request.");
      return;
    }
    if (!publicKey) {
      toast.error("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    const amountInLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

    async function requestAirdrop() {
      try {
        await connection.requestAirdrop(publicKey, amountInLamports);
        toast.success(`Airdrop of ${amount} SOL requested successfully!`);
        console.log("Requesting airdrop of:", amount);
      } catch (error) {
        toast.error("Airdrop request failed.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    requestAirdrop();
  };

  React.useEffect(() => {
    setAmount("");
  }, []);

  return (
    <div className="flex justify-center mt-5 px-4">
      <Card className="w-4xl max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Request Airdrop</CardTitle>
          <CardDescription className="font-semibold">
            Airdrop yourself on Devnet.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount" className="text-[1.2rem] font-bold">
                  Amount
                </Label>
                <Select value={amount} onValueChange={handleAmountChange}>
                  <SelectTrigger id="amount" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0.5">0.5</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="1.5">1.5</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full p-5 bg-[#512da8] hover:cursor-pointer text-balance"
            onClick={handleSubmit}
          >
            {loading ? <Spinner /> : "Request Airdrop"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
