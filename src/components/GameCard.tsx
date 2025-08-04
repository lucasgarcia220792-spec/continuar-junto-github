import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Zap, Target, TrendingUp, Coins } from 'lucide-react';

interface GameCardProps {
  onBetComplete: () => void;
}

export function GameCard({ onBetComplete }: GameCardProps) {
  const [betAmount, setBetAmount] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<{ won: boolean; multiplier: number; payout: number } | null>(null);
  const { user } = useAuth();

  const playGame = async () => {
    if (!user) return;
    
    const amount = parseFloat(betAmount);
    if (!amount || amount <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, insira um valor válido para apostar.',
        variant: 'destructive'
      });
      return;
    }

    // Verificar se o usuário tem saldo suficiente
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      toast({
        title: 'Erro',
        description: 'Erro ao verificar saldo. Tente novamente.',
        variant: 'destructive'
      });
      return;
    }

    const currentBalance = profile?.balance || 0;
    if (currentBalance < amount) {
      toast({
        title: 'Saldo insuficiente',
        description: 'Você não tem saldo suficiente para esta aposta.',
        variant: 'destructive'
      });
      return;
    }

    setIsPlaying(true);
    setGameResult(null);

    // Deduzir o valor da aposta do saldo
    const newBalance = currentBalance - amount;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('user_id', user.id);

    if (updateError) {
      toast({
        title: 'Erro',
        description: 'Erro ao processar aposta. Tente novamente.',
        variant: 'destructive'
      });
      setIsPlaying(false);
      return;
    }

    // Simular o jogo - 40% chance de vitória (mas não mostrar para o usuário)
    const won = Math.random() < 0.4;
    const multiplier = won ? 2.5 : 0;
    const payout = won ? amount * multiplier : 0;

    // Se ganhou, adicionar o prêmio ao saldo
    if (won) {
      await supabase
        .from('profiles')
        .update({ balance: newBalance + payout })
        .eq('user_id', user.id);
    }

    // Salvar aposta no banco
    const { error } = await supabase
      .from('bets')
      .insert({
        user_id: user.id,
        amount: amount,
        multiplier: multiplier,
        result: won,
        payout: payout
      });

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao processar aposta. Tente novamente.',
        variant: 'destructive'
      });
      setIsPlaying(false);
      return;
    }

    // Simular animação do jogo
    setTimeout(() => {
      setGameResult({ won, multiplier, payout });
      setIsPlaying(false);
      setBetAmount('');
      onBetComplete();
      
      toast({
        title: won ? '🎉 Você ganhou!' : '😔 Você perdeu!',
        description: won 
          ? `Parabéns! Você ganhou R$ ${payout.toFixed(2)}` 
          : `Que pena! Você perdeu R$ ${amount.toFixed(2)}`,
        variant: won ? 'default' : 'destructive',
        className: won ? 'border-secondary' : ''
      });
    }, 3000);
  };

  return (
    <Card className="gaming-card w-full max-w-md border-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
      
      <CardHeader className="text-center relative z-10">
        <CardTitle className="text-3xl font-orbitron neon-text floating">
          🎰 JOGO DA SORTE
        </CardTitle>
        <CardDescription className="text-lg font-medium">
          Teste sua sorte e ganhe grandes prêmios!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Coins className="h-4 w-4 text-accent" />
            Valor da aposta (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            disabled={isPlaying}
            className="text-center text-2xl font-bold border-primary/30 focus:border-primary bg-background/50 backdrop-blur"
          />
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-accent/50 hover:bg-accent/10 font-orbitron"
              onClick={() => setBetAmount('10')}
              disabled={isPlaying}
            >
              R$ 10
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-accent/50 hover:bg-accent/10 font-orbitron"
              onClick={() => setBetAmount('50')}
              disabled={isPlaying}
            >
              R$ 50
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-accent/50 hover:bg-accent/10 font-orbitron"
              onClick={() => setBetAmount('100')}
              disabled={isPlaying}
            >
              R$ 100
            </Button>
          </div>
        </div>

        {isPlaying && (
          <div className="text-center py-8">
            <div className="relative">
              {/* Animação de Raspadinha */}
              <div className="w-40 h-40 mx-auto relative bg-gradient-to-br from-gold via-yellow-400 to-gold rounded-xl border-4 border-gold/50 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 animate-scratch">
                  <div className="absolute inset-2 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <div className="text-6xl animate-bounce">🎰</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p className="text-xl font-orbitron font-bold neon-text animate-pulse mt-4">
              RASPANDO...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aguarde o resultado...
            </p>
          </div>
        )}

        {gameResult && (
          <div className={`text-center py-6 rounded-xl relative overflow-hidden ${
            gameResult.won 
              ? 'bg-secondary/20 border border-secondary/40' 
              : 'bg-destructive/20 border border-destructive/40'
          }`}>
            <div className="absolute inset-0 animate-pulse opacity-20 bg-current"></div>
            <div className="relative z-10">
              <p className="text-2xl font-orbitron font-black mb-2">
                {gameResult.won ? '🎉 VITÓRIA ÉPICA!' : '💀 TENTE NOVAMENTE!'}
              </p>
              <p className="text-lg font-medium">
                {gameResult.won 
                  ? (
                    <>
                      <span className="gold-text font-bold">Multiplicador: {gameResult.multiplier}x</span>
                      <br />
                      <span className="text-secondary font-bold">Prêmio: R$ {gameResult.payout.toFixed(2)}</span>
                    </>
                  )
                  : 'A sorte está chegando!'
                }
              </p>
            </div>
          </div>
        )}

        <Button 
          onClick={playGame} 
          className="w-full gaming-button font-orbitron font-bold text-xl py-8 relative overflow-hidden group"
          disabled={isPlaying || !betAmount}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 animate-pulse-glow"></div>
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isPlaying ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
                GIRANDO...
              </>
            ) : (
              <>
                <Target className="h-6 w-6" />
                APOSTAR AGORA
              </>
            )}
          </div>
        </Button>

        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h4 className="font-orbitron font-bold text-center text-accent">🎯 JOGO MISTERIOSO</h4>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline" className="border-primary/50 bg-primary/10">
                <Zap className="mr-1 h-3 w-3" />
                Prêmio até 2.5x
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Teste sua sorte! Quanto maior a aposta, maior o prêmio!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}