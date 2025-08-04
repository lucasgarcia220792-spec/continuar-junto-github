import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DepositWithdrawDialogProps {
  onTransactionComplete: () => void;
}

export function DepositWithdrawDialog({ onTransactionComplete }: DepositWithdrawDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('depositAmount') as string);

    if (!amount || amount <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, insira um valor válido para depósito.',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    // Simular processamento do depósito
    setTimeout(() => {
      toast({
        title: '💰 Depósito realizado!',
        description: `R$ ${amount.toFixed(2)} foi adicionado à sua conta.`,
        className: 'border-secondary'
      });
      onTransactionComplete();
      setIsOpen(false);
      setIsLoading(false);
    }, 2000);
  };

  const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('withdrawAmount') as string);

    if (!amount || amount <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, insira um valor válido para saque.',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    // Simular processamento do saque
    setTimeout(() => {
      toast({
        title: '💸 Saque solicitado!',
        description: `R$ ${amount.toFixed(2)} será processado em até 24h.`,
        className: 'border-accent'
      });
      onTransactionComplete();
      setIsOpen(false);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gaming-button font-orbitron font-bold text-lg px-8 py-6 neon-pulse">
          <DollarSign className="mr-2 h-6 w-6" />
          Carteira
        </Button>
      </DialogTrigger>
      
      <DialogContent className="gaming-card max-w-2xl border-primary/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron neon-text text-center">
            💎 Gerenciar Carteira
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Deposite ou saque seus fundos de forma rápida e segura
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="deposit" className="font-orbitron data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              Depósito
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="font-orbitron data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Saque
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-6">
            <Card className="gaming-card border-secondary/30">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-secondary">
                  <TrendingUp className="h-6 w-6" />
                  Fazer Depósito
                </CardTitle>
                <CardDescription>
                  Adicione fundos à sua conta para começar a apostar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="depositAmount" className="font-medium">
                      Valor do Depósito (R$)
                    </Label>
                    <Input
                      id="depositAmount"
                      name="depositAmount"
                      type="number"
                      step="0.01"
                      min="10"
                      placeholder="100.00"
                      className="text-center text-lg font-bold border-secondary/30 focus:border-secondary"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-secondary/50 hover:bg-secondary/10"
                      onClick={() => {
                        const input = document.getElementById('depositAmount') as HTMLInputElement;
                        if (input) input.value = '50';
                      }}
                    >
                      R$ 50
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-secondary/50 hover:bg-secondary/10"
                      onClick={() => {
                        const input = document.getElementById('depositAmount') as HTMLInputElement;
                        if (input) input.value = '100';
                      }}
                    >
                      R$ 100
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-secondary/50 hover:bg-secondary/10"
                      onClick={() => {
                        const input = document.getElementById('depositAmount') as HTMLInputElement;
                        if (input) input.value = '500';
                      }}
                    >
                      R$ 500
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-medium">Métodos de Pagamento</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Badge variant="outline" className="p-3 justify-center border-secondary/50 hover:bg-secondary/10 cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        PIX
                      </Badge>
                      <Badge variant="outline" className="p-3 justify-center border-secondary/50 hover:bg-secondary/10 cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Cartão
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gaming-button bg-secondary hover:bg-secondary/90 text-secondary-foreground font-orbitron font-bold text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Processando...
                      </div>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Depositar Agora
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <Card className="gaming-card border-accent/30">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-accent">
                  <DollarSign className="h-6 w-6" />
                  Solicitar Saque
                </CardTitle>
                <CardDescription>
                  Retire seus ganhos de forma rápida e segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawAmount" className="font-medium">
                      Valor do Saque (R$)
                    </Label>
                    <Input
                      id="withdrawAmount"
                      name="withdrawAmount"
                      type="number"
                      step="0.01"
                      min="10"
                      placeholder="100.00"
                      className="text-center text-lg font-bold border-accent/30 focus:border-accent"
                      required
                    />
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-accent">Informações importantes:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Valor mínimo: R$ 10,00</li>
                      <li>• Processamento: até 24 horas</li>
                      <li>• Taxa: Gratuita para PIX</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gaming-button bg-accent hover:bg-accent/90 text-accent-foreground font-orbitron font-bold text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Processando...
                      </div>
                    ) : (
                      <>
                        <DollarSign className="mr-2 h-5 w-5" />
                        Solicitar Saque
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}