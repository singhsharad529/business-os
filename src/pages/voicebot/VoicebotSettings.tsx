export function VoicebotSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Voicebot Settings</h1>
        <p className="text-text-muted mt-1">Configure your voicebot preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <h2 className="text-lg font-semibold text-text-main mb-4">Voice Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Voice Type
              </label>
              <select className="w-full px-4 py-2 bg-bg border border-border-subtle rounded-lg text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Natural Female</option>
                <option>Natural Male</option>
                <option>Professional Female</option>
                <option>Professional Male</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Speaking Speed
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                defaultValue="1"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Language
              </label>
              <select className="w-full px-4 py-2 bg-bg border border-border-subtle rounded-lg text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-border-subtle shadow-soft">
          <h2 className="text-lg font-semibold text-text-main mb-4">Behavior Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-main">Auto-respond to greetings</div>
                <div className="text-xs text-text-muted">Automatically greet callers</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-bg peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-main">Record conversations</div>
                <div className="text-xs text-text-muted">Save all voice interactions</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-bg peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-main">Enable AI suggestions</div>
                <div className="text-xs text-text-muted">Get AI-powered conversation tips</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-bg peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-6 py-2 border border-border-subtle rounded-lg text-sm font-medium text-text-main hover:bg-bg transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

