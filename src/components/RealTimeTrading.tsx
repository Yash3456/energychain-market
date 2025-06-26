
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, TrendingUp, TrendingDown, Activity, Clock, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/hooks/useAppRedux";
import { useBlockchain } from "@/hooks/useBlockchain";

interface MarketData {
  price: number;
  change: number;
  volume: number;
  high24h: number;
  low24h: number;
  lastUpdate: number;
}

interface TradeOrder {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  status: 'pending' | 'filled' | 'cancelled';
}

const RealTimeTrading = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    price: 0.12,
    change: 2.5,
    volume: 15420,
    high24h: 0.15,
    low24h: 0.10,
    lastUpdate: Date.now()
  });

  const [tradeAmount, setTradeAmount] = useState("");
  const [tradePrice, setTradePrice] = useState("");
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [activeOrders, setActiveOrders] = useState<TradeOrder[]>([]);
  const [recentTrades, setRecentTrades] = useState<TradeOrder[]>([]);

  const { isConnected, tokenBalance, ethBalance } = useAppSelector(state => state.blockchain);
  const { isUsingBlockchain } = useAppSelector(state => state.listings);
  const blockchain = useBlockchain();

  // Simulate real-time market data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const priceChange = (Math.random() - 0.5) * 0.02;
        const newPrice = Math.max(0.05, prev.price + priceChange);
        const changePercent = ((newPrice - prev.price) / prev.price) * 100;
        
        return {
          ...prev,
          price: newPrice,
          change: changePercent,
          volume: prev.volume + Math.floor(Math.random() * 100),
          lastUpdate: Date.now()
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-fill current market price
  useEffect(() => {
    setTradePrice(marketData.price.toFixed(4));
  }, [marketData.price]);

  const handleTrade = async () => {
    if (!tradeAmount || !tradePrice) {
      toast({
        title: "Missing information",
        description: "Please enter both amount and price",
        variant: "destructive",
      });
      return;
    }

    if (isUsingBlockchain && !isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to trade",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(tradeAmount);
    const price = parseFloat(tradePrice);
    const total = amount * price;

    // Check balances
    if (tradeType === 'buy' && tokenBalance < total) {
      toast({
        title: "Insufficient balance",
        description: `You need ${total.toFixed(2)} tokens to make this purchase`,
        variant: "destructive",
      });
      return;
    }

    // Create new order
    const newOrder: TradeOrder = {
      id: Math.random().toString(36).substring(2, 9),
      type: tradeType,
      amount,
      price,
      timestamp: Date.now(),
      status: 'pending'
    };

    setActiveOrders(prev => [newOrder, ...prev]);

    // Simulate order processing
    setTimeout(() => {
      setActiveOrders(prev => prev.map(order => 
        order.id === newOrder.id 
          ? { ...order, status: 'filled' }
          : order
      ));
      
      setRecentTrades(prev => [{ ...newOrder, status: 'filled' }, ...prev.slice(0, 9)]);
      
      toast({
        title: "Trade executed",
        description: `${tradeType === 'buy' ? 'Bought' : 'Sold'} ${amount} kWh at ${price} tokens each`,
      });

      // Clear form
      setTradeAmount("");
    }, 2000 + Math.random() * 3000);
  };

  const cancelOrder = (orderId: string) => {
    setActiveOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' }
        : order
    ));

    toast({
      title: "Order cancelled",
      description: "Your trade order has been cancelled",
    });
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Real-Time Energy Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold">{marketData.price.toFixed(4)} Tokens</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">24h Change</p>
              <div className="flex items-center justify-center">
                {marketData.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={marketData.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {marketData.change.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Volume</p>
              <p className="text-lg font-semibold">{marketData.volume.toLocaleString()} kWh</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">24h High</p>
              <p className="text-lg font-semibold">{marketData.high24h.toFixed(4)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">24h Low</p>
              <p className="text-lg font-semibold">{marketData.low24h.toFixed(4)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trading Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Quick Trade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button
                variant={tradeType === 'buy' ? 'default' : 'outline'}
                onClick={() => setTradeType('buy')}
                className="flex-1"
              >
                Buy Energy
              </Button>
              <Button
                variant={tradeType === 'sell' ? 'default' : 'outline'}
                onClick={() => setTradeType('sell')}
                className="flex-1"
              >
                Sell Energy
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trade-amount">Amount (kWh)</Label>
              <Input
                id="trade-amount"
                type="number"
                placeholder="Enter energy amount"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                min="0.1"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trade-price">Price (Tokens per kWh)</Label>
              <Input
                id="trade-price"
                type="number"
                placeholder="Enter price"
                value={tradePrice}
                onChange={(e) => setTradePrice(e.target.value)}
                min="0.01"
                step="0.0001"
              />
            </div>

            {tradeAmount && tradePrice && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Total: </span>
                  {(parseFloat(tradeAmount) * parseFloat(tradePrice)).toFixed(4)} Tokens
                </p>
                {isConnected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {tokenBalance.toFixed(2)} Tokens
                  </p>
                )}
              </div>
            )}

            <Button 
              onClick={handleTrade}
              className="w-full"
              disabled={!tradeAmount || !tradePrice}
            >
              {tradeType === 'buy' ? 'Buy Energy' : 'Sell Energy'}
            </Button>
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active orders</p>
            ) : (
              <div className="space-y-2">
                {activeOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={order.type === 'buy' ? 'default' : 'secondary'}>
                        {order.type.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">
                          {order.amount} kWh @ {order.price.toFixed(4)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        order.status === 'filled' ? 'default' :
                        order.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                      {order.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Recent Market Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTrades.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent trades</p>
          ) : (
            <div className="space-y-2">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center space-x-3">
                    <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'} className="w-12">
                      {trade.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm">
                      {trade.amount} kWh @ {trade.price.toFixed(4)} Tokens
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeTrading;
