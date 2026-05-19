import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Plus, TrendingUp, TrendingDown, Wallet, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
}

const initialTransactions: Transaction[] = [
  { id: '1', type: 'income', category: 'Crop Sales', amount: 4500, description: 'Sold 5 tons maize at $900/ton', date: '2025-01-15' },
  { id: '2', type: 'expense', category: 'Seeds', amount: 750, description: 'Purchased SC 403 maize seed (50kg)', date: '2025-01-10' },
  { id: '3', type: 'expense', category: 'Fertilizer', amount: 1200, description: 'Compound D and AN for 10 hectares', date: '2025-01-08' },
  { id: '4', type: 'expense', category: 'Labor', amount: 800, description: 'Monthly labor costs - January', date: '2025-01-05' },
  { id: '5', type: 'income', category: 'Livestock', amount: 1200, description: 'Sold 3 cattle at auction', date: '2024-12-20' },
  { id: '6', type: 'expense', category: 'Equipment', amount: 350, description: 'Knapsack sprayer replacement', date: '2024-12-15' },
  { id: '7', type: 'expense', category: 'Pesticides', amount: 280, description: 'Armyworm treatment for 5 hectares', date: '2024-12-10' },
  { id: '8', type: 'income', category: 'Produce', amount: 650, description: 'Tomato sales - December', date: '2024-12-05' },
]

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newTx, setNewTx] = useState<{ type: 'income' | 'expense'; category: string; amount: string; description: string; date: string }>({ type: 'expense', category: '', amount: '', description: '', date: '' })

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const netProfit = totalIncome - totalExpenses

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc }, {} as Record<string, number>)
  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))

  const monthlyData = [
    { month: 'Oct', income: 2800, expenses: 1500 },
    { month: 'Nov', income: 3200, expenses: 1800 },
    { month: 'Dec', income: 1850, expenses: 2430 },
    { month: 'Jan', income: 4500, expenses: 2750 },
  ]

  const handleAdd = () => {
    if (!newTx.category || !newTx.amount) return
    setTransactions([{ id: Date.now().toString(), ...newTx, amount: parseFloat(newTx.amount) }, ...transactions])
    setNewTx({ type: 'expense', category: '', amount: '', description: '', date: '' })
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance Tracker</h1>
          <p className="text-muted-foreground">Track farm income, expenses, and profitability</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Transaction</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Transaction</DialogTitle><DialogDescription>Record a new income or expense</DialogDescription></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Type</label>
                  <Select value={newTx.type} onValueChange={(v) => setNewTx({ ...newTx, type: v as 'income' | 'expense' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><label className="text-sm font-medium">Category</label>
                  <Select value={newTx.category} onValueChange={(v) => setNewTx({ ...newTx, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {newTx.type === 'income'
                        ? ['Crop Sales', 'Livestock', 'Produce', 'Services', 'Other'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)
                        : ['Seeds', 'Fertilizer', 'Pesticides', 'Labor', 'Equipment', 'Fuel', 'Irrigation', 'Other'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Amount (USD)</label><Input type="number" placeholder="0.00" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Date</label><Input type="date" value={newTx.date} onChange={(e) => setNewTx({ ...newTx, date: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Description</label><Textarea placeholder="Details..." value={newTx.description} onChange={(e) => setNewTx({ ...newTx, description: e.target.value })} /></div>
              <Button onClick={handleAdd} className="w-full">Save Transaction</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</div></CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</div></CardContent>
        </Card>
        <Card className={netProfit >= 0 ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>${netProfit.toLocaleString()}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly Overview</CardTitle><CardDescription>Income vs Expenses by month</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Expense Breakdown</CardTitle><CardDescription>Where your money goes</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle><CardDescription>Your latest financial records</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${tx.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-red-100 text-red-600 dark:bg-red-900/20'}`}>
                    {tx.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
