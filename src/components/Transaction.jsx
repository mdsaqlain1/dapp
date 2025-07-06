import * as React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";

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

export default function TransactionComponent() {
  const [recipient, setRecipient] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipient) {
      toast.error("Please enter a recipient address.");
      return;
    }
    if (!amount) {
      toast.error("Please enter an amount.");
      return;
    }
    if (!publicKey) {
      toast.error("Please connect your wallet.");
      return;
    }

    try {
      setLoading(true);

      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      console.log(`Sending ${lamports} lamports to ${recipientPubkey.toBase58()}`);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      toast.success(`Transaction submitted: ${signature}`);

      await connection.confirmTransaction(signature, "confirmed");
      toast.success("Transaction confirmed!");

      console.log("Transaction Signature:", signature);

      // Reset inputs
      setRecipient("");
      setAmount("");
    } catch (error) {
      toast.error(`Transaction failed. ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 px-0 lg:px-4">
      <Card className="md:w-full sm:flex sm:justify-center mx-auto sm:w-sm w-xs">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Send Solana</CardTitle>
          <CardDescription className="font-semibold">
            Transfer SOL to any wallet on Devnet.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="recipient" className="text-[1.1rem] font-bold">
                  Recipient Wallet Address
                </Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter wallet address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount1" className="text-[1.1rem] font-bold">
                  Amount (SOL)
                </Label>
                <Input
                  id="amount1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 0.5"
                  type="number"
                  min="0"
                  step="0.0001"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full p-5 bg-[#512da8] hover:cursor-pointer mt-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Send SOL"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
