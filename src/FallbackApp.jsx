import React from 'react';

export default function FallbackApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 24C12.4183 24 16 20.4183 16 16H8V24Z" fill="#0ACF83"/>
              <path d="M0 16C0 20.4183 3.58172 24 8 24C8 19.5817 8 16 8 16H0Z" fill="#A259FF"/>
              <path d="M0 8C0 12.4183 3.58172 16 8 16H8V8C8 8 4.24264 8 0 8Z" fill="#F24E1E"/>
              <path d="M8 0C3.58172 0 0 3.58172 0 8C4.24264 8 8 8 8 8V0Z" fill="#FF7262"/>
              <path d="M16 8C16 12.4183 19.5817 16 24 16C24 11.5817 24 8 24 8H16Z" fill="#1ABCFE"/>
            </svg>
            <h1 className="text-4xl font-bold text-slate-800">QUICKFIGMA</h1>
          </div>
          <p className="text-xl text-slate-600 mb-8">Guida Pratica al Design Sistemico</p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">🚧 Modalità Fallback</h2>
            <p className="text-slate-600 mb-6">
              L'applicazione principale non si è caricata correttamente. 
              Questo può essere dovuto a problemi di rete o configurazione.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">📖 Contenuto Disponibile</h3>
              <p className="text-blue-700 text-sm">
                La documentazione completa sarà disponibile una volta risolti i problemi tecnici.
                Include guide dettagliate su Design Systems, componenti riutilizzabili, 
                responsive design e best practices per Figma.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">🎯 Cosa Imparerai</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Design System professionali</li>
                  <li>• Componenti scalabili</li>
                  <li>• Workflow ottimizzati</li>
                  <li>• Collaborazione con dev team</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">🛠️ Tecnologie</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• React & Tailwind CSS</li>
                  <li>• Markdown rendering</li>
                  <li>• Ricerca full-text</li>
                  <li>• Design responsive</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-slate-500">
                Made with ❤️ by{' '}
                <a href="https://github.com/micheledalsanto" className="text-blue-600 hover:underline">
                  Michele Dal Santo
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}