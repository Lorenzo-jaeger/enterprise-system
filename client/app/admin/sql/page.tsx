"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Database, Play, MoreHorizontal, FileText, Trash2, Calculator, Search, Code, Copy, Check, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  query: z.string().min(5, { message: "Digite uma query válida." }),
})

export default function SqlPlaygroundPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { token, user } = useAuthStore()
  
  // Hydration & Utils
  const [isMounted, setIsMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Data
  const [tables, setTables] = useState<string[]>([])
  const [loadingTables, setLoadingTables] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Generative UI State
  const [selectedTableForCrud, setSelectedTableForCrud] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Inline Editing State
  const [activeTable, setActiveTable] = useState<string | null>(null) // Tracks which table is currently being viewed
  const [editingCell, setEditingCell] = useState<{ rowId: string, col: string } | null>(null)
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({}) // Key: "rowId-col", Value: newValue
  const [saving, setSaving] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "SELECT * FROM public.\"User\" LIMIT 10;",
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    async function fetchTables() {
        if (!token) return
        setLoadingTables(true)
        try {
            const res = await fetch("http://localhost:3001/admin/tables", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setTables(data)
            }
        } catch (e) {
            toast.error("Erro ao carregar tabelas")
        } finally {
            setLoadingTables(false)
        }
    }
    fetchTables()
  }, [token, isMounted])

  const filteredTables = tables.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()))

  // Execute SQL
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResults(null)
    setError(null)
    setPendingChanges({}) // Reset changes on new query
    // Determine active table from query simple check
    // Very basic heuristic: check if query starts with select * from "Table"
    const match = values.query.match(/FROM\s+"?(\w+)"?/i)
    if (match && tables.includes(match[1])) {
       // Only set active table if we matched a known table. 
       // This enables editing features.
       setActiveTable(match[1]) 
    } else {
       setActiveTable(null)
    }

    try {
      const response = await fetch("http://localhost:3001/admin/sql", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        toast.error("Erro na execução SQL")
      } else {
        setResults(Array.isArray(data) ? data : [data])
        toast.success("Query executada com sucesso!")
      }

    } catch (error) {
      toast.error("Falha ao conectar com servidor.")
      setError("Erro de conexão.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const runQuery = (q: string, table?: string) => {
      form.setValue("query", q)
      if (table) setActiveTable(table)
      form.handleSubmit(onSubmit)()
  }

  const openCrudDialog = (table: string) => {
      setSelectedTableForCrud(table)
      setIsDialogOpen(true)
  }

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Copiado para área de transferência")
  }

  // --- Inline Editing Logic ---

  const handleCellClick = (row: any, col: string) => {
      // Only allow editing if we have an Active Table and an ID to identify the row
      if (!activeTable || !row.id) return;
      
      // Prevent editing ID itself (unsafe usually)
      if (col === 'id') return;

      setEditingCell({ rowId: row.id, col })
  }

  const handleCellChange = (value: string) => {
      if (!editingCell) return
      setPendingChanges(prev => ({
          ...prev,
          [`${editingCell.rowId}-${editingCell.col}`]: value
      }))
  }

  const handleBlur = () => {
      setEditingCell(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          setEditingCell(null) // Commit on Enter
      }
  }

  const saveChanges = async () => {
    if (!activeTable) return;
    setSaving(true)
    
    // Group changes by Row ID
    try {
        const updates = Object.entries(pendingChanges).reduce((acc, [key, value]) => {
            // Fix for UUIDs: Split by the LAST hyphen, as UUIDs contain hyphens.
            const lastDashIndex = key.lastIndexOf('-')
            const rowId = key.substring(0, lastDashIndex)
            const col = key.substring(lastDashIndex + 1)
            
            if (!acc[rowId]) acc[rowId] = {}
            acc[rowId][col] = value
            return acc
        }, {} as Record<string, Record<string, any>>)

        const errors: string[] = []
        let successCount = 0
        let failCount = 0

        for (const [rowId, cols] of Object.entries(updates)) {
            // Construct UPDATE Query
            // UPDATE "Table" SET "col" = 'val', "col2" = 'val2' WHERE "id" = 'rowId';
            const setClause = Object.entries(cols).map(([col, val]) => {
                // Determine if string or number (naive check)
                const isNum = !isNaN(Number(val)) && val.trim() !== ''
                // Handle 'true'/'false' specifically if needed, but PG usually accepts strings.
                // Better safety for null:
                if (val === 'NULL' || val === null) return `"${col}" = NULL`
                
                return `"${col}" = ${isNum ? val : `'${val}'`}`
            }).join(', ')

            const query = `UPDATE "${activeTable}" SET ${setClause} WHERE "id" = '${rowId}';`
            
            console.log("Executando Update:", query) // Debug log to console

            const res = await fetch("http://localhost:3001/admin/sql", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ query }),
            })
            
            const data = await res.json()
            
            if (res.ok && !data.error) {
                successCount++
            } else {
                failCount++
                const msg = data.error || data.message || "Erro desconhecido"
                errors.push(msg)
                console.error("Erro ao salvar:", msg)
            }
        }

        if (failCount === 0) {
            toast.success(`Salvo! ${successCount} registro(s) atualizado(s).`)
            setPendingChanges({})
            // Refresh Data
            form.handleSubmit(onSubmit)() 
        } else {
             toast.error(`Erro ao salvar. ${errors.join(' | ')}`)
        }

    } catch (e: any) {
        console.error("Erro crítico ao salvar:", e)
        toast.error(`Erro crítico: ${e.message || "Falha desconhecida"}`)
    } finally {
        setSaving(false)
    }
  }


  // Auth Checks
  if (!isMounted) {
      return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  if (!user || !user.roles?.includes('ADMIN')) {
     return <div className="p-8 text-center text-red-500 font-bold text-xl">Acesso Negado: Apenas Administradores.</div>
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-4 p-4 overflow-hidden bg-background">
        {/* Sidebar - Table List */}
        <Card className="w-full md:w-72 flex-shrink-0 flex flex-col max-h-[30vh] md:max-h-full">
            <CardHeader className="p-4 border-b space-y-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Tabelas
                </CardTitle>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar tabela..." 
                        className="h-8 pl-8 text-xs" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full">
                    <div className="p-2 space-y-1">
                        {loadingTables ? (
                            <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
                        ) : filteredTables.length === 0 ? (
                            <div className="p-4 text-center text-xs text-muted-foreground">Nenhuma tabela encontrada.</div>
                        ) : (
                             filteredTables.map(table => (
                                <div key={table} className="flex items-center group">
                                    <Button 
                                        variant="ghost" 
                                        className={`flex-1 justify-start font-mono text-xs px-2 h-8 truncate overflow-hidden ${activeTable === table ? 'bg-muted font-bold' : ''}`}
                                        onClick={() => runQuery(`SELECT * FROM "${table}" LIMIT 50;`, table)}
                                        title={table}
                                    >
                                        <span className="truncate">{table}</span>
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel className="text-xs">{table}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => openCrudDialog(table)}>
                                                <Code className="mr-2 h-3.5 w-3.5" />
                                                Gerar SQL / CRUD
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => runQuery(`SELECT * FROM "${table}" LIMIT 100;`, table)}>
                                                <FileText className="mr-2 h-3.5 w-3.5" />
                                                Select Top 100
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => runQuery(`SELECT COUNT(*) as total FROM "${table}";`, table)}>
                                                <Calculator className="mr-2 h-3.5 w-3.5" />
                                                Contar Registros
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-500 text-xs" onClick={() => runQuery(`DROP TABLE "${table}";`)}>
                                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                Drop Table
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>

        {/* Main - Editor & Results */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-0 pl-1 pb-2">
            {/* ... Editor ... */}
            <Card className="flex-shrink-0 shadow-sm border-muted-foreground/20">
                <CardContent className="p-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Textarea 
                                    placeholder="SELECT * FROM ..." 
                                    className="font-mono bg-zinc-950 text-zinc-100 min-h-[120px] resize-y" 
                                    {...field} 
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2">
                             {Object.keys(pendingChanges).length > 0 && (
                                 <Button type="button" onClick={saveChanges} disabled={saving} variant="default" size="sm" className="bg-green-600 hover:bg-green-700 shadow-sm">
                                     {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                     Salvar Alterações ({Object.keys(pendingChanges).length})
                                 </Button>
                             )}
                            <Button type="submit" disabled={isLoading} size="sm">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Play className="mr-2 h-4 w-4" />
                                Executar (F9)
                            </Button>
                        </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Results */}
            <Card className="flex-1 flex flex-col shadow-sm border-muted-foreground/20 overflow-hidden py-0 gap-0">
                 <div className="flex-1 overflow-auto p-0 relative w-full h-full">
                    {error && (
                        <div className="p-4 bg-red-950/30 text-red-400 font-mono text-sm border-b border-red-900 sticky top-0 z-20">
                            <strong>Erro:</strong> {error}
                        </div>
                    )}
                    
                    {results && (
                        <table className="min-w-full text-sm text-left border-collapse table-auto">
                            <thead className="text-xs uppercase bg-muted/90 backdrop-blur supports-[backdrop-filter]:bg-muted/60 sticky top-0 z-10 shadow-sm text-foreground">
                                <tr>
                                    {results.length > 0 && Object.keys(results[0]).map((key) => (
                                        <th key={key} className="px-4 py-3 font-medium border-b border-r last:border-r-0 whitespace-nowrap min-w-[100px]">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        {Object.values(row).map((val: any, j) => {
                                             const colName = Object.keys(results[0])[j];
                                             const cellKey = `${row.id}-${colName}`;
                                             const isEditing = editingCell?.rowId === row.id && editingCell?.col === colName;
                                             const hasChanged = pendingChanges[cellKey] !== undefined;
                                             const displayValue = hasChanged ? pendingChanges[cellKey] : val;
                                            
                                            return (
                                            <td 
                                                key={j} 
                                                className={`px-4 py-2 font-mono text-xs border-r last:border-r-0 cursor-pointer whitespace-nowrap max-w-[400px] overflow-hidden text-ellipsis hover:bg-muted ${hasChanged ? 'bg-yellow-500/10' : ''}`}
                                                onDoubleClick={() => handleCellClick(row, colName)}
                                                title={typeof displayValue === 'object' ? JSON.stringify(displayValue) : String(displayValue)}
                                            >
                                                {isEditing ? (
                                                    <Input 
                                                        autoFocus
                                                        className="h-6 w-full text-xs font-mono p-1 min-w-[150px]"
                                                        value={pendingChanges[cellKey] !== undefined ? pendingChanges[cellKey] : (val === null ? '' : String(val))}
                                                        onChange={(e) => handleCellChange(e.target.value)}
                                                        onBlur={handleBlur}
                                                        onKeyDown={handleKeyDown}
                                                    />
                                                ) : (
                                                    <div className="min-h-[20px] flex items-center">
                                                        {typeof displayValue === 'object' ? JSON.stringify(displayValue) : String(displayValue)}
                                                    </div>
                                                )}
                                            </td>
                                        )})}
                                    </tr>
                                ))}
                                {results.length === 0 && (
                                    <tr><td className="p-8 text-center text-muted-foreground w-full">Nenhum resultado retornado.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                    
                    {!results && !error && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                             <Database className="h-10 w-10 opacity-20" />
                            <p>Selecione uma tabela ou execute uma query.</p>
                        </div>
                    )}
                 </div>
                 {results && (
                     <div className="flex-shrink-0 p-2 border-t text-xs text-muted-foreground bg-muted/20 flex justify-between items-center z-20 bg-background/95 backdrop-blur">
                         <span>{results.length} linhas retornadas</span>
                         {activeTable && <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"/> Edição Ativa: {activeTable}</span>}
                     </div>
                 )}
            </Card>
        </div>

        {/* CRUD Generator Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {/* Same as before */}
             <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Gerador SQL - {selectedTableForCrud}</DialogTitle>
                    <DialogDescription>Templates prontos para manipulação da tabela.</DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="select">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="select">SELECT</TabsTrigger>
                        <TabsTrigger value="insert">INSERT</TabsTrigger>
                        <TabsTrigger value="update">UPDATE</TabsTrigger>
                        <TabsTrigger value="delete">DELETE</TabsTrigger>
                    </TabsList>
                    
                    {['select', 'insert', 'update', 'delete'].map((type) => (
                        <TabsContent key={type} value={type} className="space-y-4">
                            <div className="relative">
                                <Textarea 
                                    readOnly
                                    className="font-mono h-48 bg-muted text-xs resize-none p-4" 
                                    value={generateCrudTemplate(type, selectedTableForCrud || "")}
                                />
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="absolute top-2 right-2 h-8"
                                    onClick={() => copyToClipboard(generateCrudTemplate(type, selectedTableForCrud || ""))}
                                >
                                    {copied ? <Check className="h-3.5 w-3.5 mr-2 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
                                    {copied ? "Copiado" : "Copiar"}
                                </Button>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </DialogContent>
        </Dialog>
    </div>
  )
}

function generateCrudTemplate(type: string, table: string) {
    /* Same as before */
    switch (type) {
        case 'select':
            return `SELECT * FROM "${table}"\nWHERE condition\nLIMIT 100;`;
        case 'insert':
            return `INSERT INTO "${table}" \n(\n  -- columns\n) \nVALUES \n(\n  -- values\n);`;
        case 'update':
            return `UPDATE "${table}" \nSET \n  column1 = value1, \n  column2 = value2 \nWHERE condition;`;
        case 'delete':
            return `DELETE FROM "${table}" \nWHERE condition;`;
        default:
            return '';
    }
}
