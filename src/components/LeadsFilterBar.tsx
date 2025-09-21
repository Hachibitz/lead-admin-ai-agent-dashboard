import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Paper } from '@mui/material';
import { statusMap, temperatureMap, portalMap, subjectMap, type LeadsFilterBarProps } from '../types/lead.model';

export function LeadsFilterBar({ filters, onFilterChange, onClear }: LeadsFilterBarProps) {
  return (
    <Box component={Paper} elevation={2} sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField 
        label="Buscar por nome, email..."
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1, minWidth: '200px' }}
        value={filters.searchText}
        onChange={(e) => onFilterChange('searchText', e.target.value)}
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select 
          value={filters.status} 
          label="Status" 
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <MenuItem value=""><em>Todos</em></MenuItem>
          {Object.entries(statusMap).map(([code, value]) => (
            <MenuItem key={code} value={value.enum}>{value.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Temperatura</InputLabel>
        <Select 
          value={filters.temperature} 
          label="Temperatura" 
          onChange={(e) => onFilterChange('temperature', e.target.value)}
        >
          <MenuItem value=""><em>Todas</em></MenuItem>
          {Object.entries(temperatureMap).map(([code, value]) => (
            <MenuItem key={code} value={value.enum}>{value.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Portal</InputLabel>
        <Select 
          value={filters.portal} 
          label="Portal" 
          onChange={(e) => onFilterChange('portal', e.target.value)}
        >
          <MenuItem value=""><em>Todos</em></MenuItem>
          {Object.entries(portalMap).map(([code, value]) => (
            <MenuItem key={code} value={value.enum}>{value.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Assunto</InputLabel>
        <Select 
          value={filters.subject} 
          label="Assunto" 
          onChange={(e) => onFilterChange('subject', e.target.value)}
        >
          <MenuItem value=""><em>Todos</em></MenuItem>
          {Object.entries(subjectMap).map(([code, value]) => (
            <MenuItem key={code} value={value.enum}>{value.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={onClear}>Limpar Filtros</Button>
    </Box>
  );
}