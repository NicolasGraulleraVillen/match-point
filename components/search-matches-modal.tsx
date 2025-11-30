"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Level } from "@/types"
import { getSportName } from "@/lib/sport-utils"
import { toast } from "sonner"

export interface MatchFilters {
  minDate: string
  maxDate: string
  time: string
  sport: string
  level: Level | "all"
  maxDistance: number
}

interface SearchMatchesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch: (filters: MatchFilters) => void
}

export function SearchMatchesModal({ open, onOpenChange, onSearch }: SearchMatchesModalProps) {
  const [minDate, setMinDate] = useState("")
  const [maxDate, setMaxDate] = useState("")
  const [time, setTime] = useState("")
  const [sport, setSport] = useState<string>("all")
  const [level, setLevel] = useState<Level | "all">("all")
  const [maxDistance, setMaxDistance] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      minDate,
      maxDate,
      time,
      sport,
      level,
      maxDistance: maxDistance ? parseInt(maxDistance) : 0,
    })
    toast.success("Filtros aplicados")
    onOpenChange(false)
  }

  const handleReset = () => {
    setMinDate("")
    setMaxDate("")
    setTime("")
    setSport("all")
    setLevel("all")
    setMaxDistance("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Buscar Partidos
          </DialogTitle>
          <DialogDescription>
            Filtra los partidos disponibles por fecha, deporte y nivel
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-date">Fecha desde</Label>
              <Input
                id="min-date"
                type="date"
                value={minDate}
                onChange={(e) => setMinDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="max-date">Fecha hasta</Label>
              <Input
                id="max-date"
                type="date"
                value={maxDate}
                onChange={(e) => setMaxDate(e.target.value)}
                min={minDate || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="time">Hora</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Filtrar por hora aproximada
            </p>
          </div>

          <div>
            <Label htmlFor="filter-sport">Deporte</Label>
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger id="filter-sport">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los deportes</SelectItem>
                <SelectItem value="Fútbol">{getSportName("Fútbol")}</SelectItem>
                <SelectItem value="Baloncesto">{getSportName("Baloncesto")}</SelectItem>
                <SelectItem value="Tenis">{getSportName("Tenis")}</SelectItem>
                <SelectItem value="Pádel">{getSportName("Pádel")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-level">Nivel</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as Level | "all")}>
              <SelectTrigger id="filter-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="novato">Novato</SelectItem>
                <SelectItem value="intermedio">Intermedio</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="max-distance">Distancia máxima (km)</Label>
            <Input
              id="max-distance"
              type="number"
              min="0"
              step="1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              placeholder="Sin límite"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
              Limpiar
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Buscar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

