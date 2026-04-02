import { useState } from 'react';
import { updateConfig } from '../../data/store';
import { useConfiguracoes } from '../../hooks/useData';
import { useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import type { Configuracoes } from '../../types';

export default function Ajustes() {
  const { config: globalConfig, loading } = useConfiguracoes();
  const [config, setConfig] = useState<Configuracoes | null>(globalConfig);

  useEffect(() => {
    if (globalConfig) setConfig(globalConfig);
  }, [globalConfig]);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const toggleDay = (day: string) => {
    if (!config) return;
    const newDays = config.diasTrabalho.includes(day)
      ? config.diasTrabalho.filter(d => d !== day)
      : [...config.diasTrabalho, day];
    setConfig({ ...config, diasTrabalho: newDays });
  };

  const handleSave = async () => {
    if (!config) return;
    await updateConfig(config);
    showToast('Configurações salvas com sucesso!');
  };


  if (loading || !config) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando configurações...</div>;
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Ajustes</h1>
        <p>Configurações do sistema</p>
      </div>

      <div className="settings-grid">
        <div className="card animate-fadeInUp stagger-1">
          <div className="card-header">
            <h2 className="card-title"><Settings size={18} /> Perfil do Trainer</h2>
          </div>
          <div style={{ padding: '0 20px 20px' }}>
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                className="form-input"
                value={config.nomeTrainer}
                onChange={e => setConfig({ ...config, nomeTrainer: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="card animate-fadeInUp stagger-2">
          <div className="card-header">
            <h2 className="card-title">💰 Financeiro</h2>
          </div>
          <div style={{ padding: '0 20px 20px' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Meta Mensal (alunos)</label>
                <input
                  className="form-input"
                  type="number"
                  value={config.metaMensal}
                  onChange={e => setConfig({ ...config, metaMensal: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Valor Mensalidade (R$)</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.01"
                  value={config.valorMensalidade}
                  onChange={e => setConfig({ ...config, valorMensalidade: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card animate-fadeInUp stagger-3">
          <div className="card-header">
            <h2 className="card-title">🕐 Horário de Trabalho</h2>
          </div>
          <div style={{ padding: '0 20px 20px' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Início</label>
                <input
                  className="form-input"
                  type="time"
                  value={config.horarioInicio}
                  onChange={e => setConfig({ ...config, horarioInicio: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fim</label>
                <input
                  className="form-input"
                  type="time"
                  value={config.horarioFim}
                  onChange={e => setConfig({ ...config, horarioFim: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Dias de Trabalho</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {days.map(d => (
                  <button
                    key={d}
                    type="button"
                    className={`btn btn-sm ${config.diasTrabalho.includes(d) ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => toggleDay(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave}>
          <Save size={18} /> Salvar Configurações
        </button>
      </div>

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}
