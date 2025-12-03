import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Trash2, Edit2, Check, X, Download, UserPlus, Upload, Share2 } from 'lucide-react';

export default function GiftTrackerApp() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [gifts, setGifts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ gifter: '', gift: '', contact: null });
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', address: '' });
  const [recognition, setRecognition] = useState(null);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [importText, setImportText] = useState('');
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Register service worker and check for updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          });
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcriptText = event.results[0][0].transcript;
        setTranscript(transcriptText);
        processTranscript(transcriptText);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }

    // Load saved data
    const savedGifts = localStorage.getItem('giftTrackerGifts');
    const savedContacts = localStorage.getItem('giftTrackerContacts');
    if (savedGifts) setGifts(JSON.parse(savedGifts));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
  }, []);

  // Save to localStorage whenever gifts or contacts change
  useEffect(() => {
    localStorage.setItem('giftTrackerGifts', JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem('giftTrackerContacts', JSON.stringify(contacts));
  }, [contacts]);

  const startRecording = () => {
    if (recognition) {
      setTranscript('');
      setIsRecording(true);
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const processTranscript = async (text) => {
    setIsProcessing(true);
    
    try {
      const prompt = `Parse this gift recording into structured data. The person spoke: "${text}"

Extract:
1. The gifter's name (who gave the gift)
2. What the gift was
3. Try to match the gifter to one of these contacts: ${contacts.map(c => c.name).join(', ')}

Respond ONLY with valid JSON in this exact format (no other text, no markdown, no backticks):
{
  "gifter": "person's name",
  "gift": "what they gave",
  "matchedContact": "exact contact name if match found, otherwise null"
}

DO NOT OUTPUT ANYTHING OTHER THAN VALID JSON. If the input doesn't clearly contain gift information, still output the JSON format with best guesses.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text.trim();
      
      // Strip any markdown formatting
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const parsed = JSON.parse(responseText);
      
      // Find the matched contact object
      const matchedContactObj = parsed.matchedContact 
        ? contacts.find(c => c.name === parsed.matchedContact)
        : null;

      const newGift = {
        id: Date.now(),
        gifter: parsed.gifter,
        gift: parsed.gift,
        contact: matchedContactObj,
        timestamp: new Date().toISOString()
      };

      setGifts(prev => [newGift, ...prev]);
    } catch (error) {
      console.error('Error processing transcript:', error);
      // Fallback: add the raw transcript
      const newGift = {
        id: Date.now(),
        gifter: 'Unknown',
        gift: text,
        contact: null,
        timestamp: new Date().toISOString()
      };
      setGifts(prev => [newGift, ...prev]);
    }
    
    setIsProcessing(false);
  };

  const deleteGift = (id) => {
    setGifts(prev => prev.filter(g => g.id !== id));
  };

  const startEdit = (gift) => {
    setEditingId(gift.id);
    setEditForm({
      gifter: gift.gifter,
      gift: gift.gift,
      contact: gift.contact
    });
  };

  const saveEdit = () => {
    setGifts(prev => prev.map(g => 
      g.id === editingId 
        ? { ...g, gifter: editForm.gifter, gift: editForm.gift, contact: editForm.contact }
        : g
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ gifter: '', gift: '', contact: null });
  };

  const addContact = () => {
    if (newContact.name.trim()) {
      const contact = {
        id: Date.now(),
        name: newContact.name.trim(),
        phone: newContact.phone.trim(),
        email: newContact.email.trim(),
        address: newContact.address.trim()
      };
      setContacts(prev => [...prev, contact]);
      setNewContact({ name: '', phone: '', email: '', address: '' });
      setShowContactForm(false);
    }
  };

  const importContacts = () => {
    if (!importText.trim()) return;

    try {
      // Try JSON format first
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        const newContacts = parsed.map((c, idx) => ({
          id: Date.now() + idx,
          name: c.name || c.Name || '',
          phone: c.phone || c.Phone || c.mobile || '',
          email: c.email || c.Email || '',
          address: c.address || c.Address || ''
        })).filter(c => c.name);
        setContacts(prev => [...prev, ...newContacts]);
        setImportText('');
        setShowImportOptions(false);
        return;
      }
    } catch (e) {
      // Not JSON, try CSV/text format
      const lines = importText.split('\n').filter(l => l.trim());
      const newContacts = lines.map((line, idx) => {
        const parts = line.split(/[,\t]/).map(p => p.trim());
        return {
          id: Date.now() + idx,
          name: parts[0] || '',
          phone: parts[1] || '',
          email: parts[2] || '',
          address: parts[3] || ''
        };
      }).filter(c => c.name);
      
      setContacts(prev => [...prev, ...newContacts]);
      setImportText('');
      setShowImportOptions(false);
    }
  };

  const exportData = () => {
    const csvContent = [
      'Gifter,Gift,Phone,Email,Address',
      ...gifts.map(g => 
        `"${g.gifter}","${g.gift}","${g.contact?.phone || ''}","${g.contact?.email || ''}","${g.contact?.address || ''}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gift-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 pb-20">
      {/* Update Banner */}
      {updateAvailable && (
        <div className="fixed top-0 left-0 right-0 bg-purple-600 text-white p-3 text-center z-50">
          <p className="text-sm">New version available!</p>
          <button
            onClick={updateApp}
            className="mt-1 px-4 py-1 bg-white text-purple-600 rounded-full text-sm font-medium"
          >
            Update Now
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎁 Gift Tracker</h1>
          <p className="text-gray-600">Record gifts by voice at your party!</p>
        </div>

        {/* Recording Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl transition-all transform active:scale-95 ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : isProcessing
                  ? 'bg-gray-400'
                  : 'bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg'
              }`}
            >
              {isRecording ? <MicOff /> : <Mic />}
            </button>
            
            <p className="mt-4 text-lg font-medium text-gray-700">
              {isProcessing ? 'Processing...' : isRecording ? 'Recording... (speak now)' : 'Tap to record'}
            </p>
            
            {transcript && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg max-w-md w-full">
                <p className="text-sm text-gray-600">Last recorded:</p>
                <p className="text-gray-800 italic">"{transcript}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Contacts Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Contacts ({contacts.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImportOptions(!showImportOptions)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Upload size={18} />
                Import
              </button>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <UserPlus size={18} />
                Add
              </button>
            </div>
          </div>

          {showImportOptions && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">Paste contacts below (one per line or JSON format):</p>
              <p className="text-xs text-gray-500 mb-2">Format: Name, Phone, Email, Address</p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="John Doe, 555-1234, john@email.com, 123 Main St&#10;Jane Smith, 555-5678, jane@email.com, 456 Oak Ave"
                className="w-full p-2 border border-gray-300 rounded h-32 text-sm"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={importContacts}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Import
                </button>
                <button
                  onClick={() => {
                    setShowImportOptions(false);
                    setImportText('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showContactForm && (
            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
              <input
                type="text"
                placeholder="Name *"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 mb-2 border border-gray-300 rounded text-base"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 mb-2 border border-gray-300 rounded text-base"
              />
              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 mb-2 border border-gray-300 rounded text-base"
              />
              <textarea
                placeholder="Address"
                value={newContact.address}
                onChange={(e) => setNewContact(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-3 mb-2 border border-gray-300 rounded text-base h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={addContact}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                >
                  Save Contact
                </button>
                <button
                  onClick={() => {
                    setShowContactForm(false);
                    setNewContact({ name: '', phone: '', email: '', address: '' });
                  }}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {contacts.map(contact => (
              <div key={contact.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
                  {contact.email && <p className="text-sm text-gray-600">{contact.email}</p>}
                  {contact.address && <p className="text-xs text-gray-500 mt-1">{contact.address}</p>}
                </div>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Gift List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Gift List ({gifts.length})</h2>
            {gifts.length > 0 && (
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download size={18} />
                Export CSV
              </button>
            )}
          </div>

          {gifts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No gifts recorded yet. Start by tapping the microphone!</p>
          ) : (
            <div className="space-y-3">
              {gifts.map(gift => (
                <div key={gift.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  {editingId === gift.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.gifter}
                        onChange={(e) => setEditForm(prev => ({ ...prev, gifter: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded text-base"
                        placeholder="Gifter name"
                      />
                      <input
                        type="text"
                        value={editForm.gift}
                        onChange={(e) => setEditForm(prev => ({ ...prev, gift: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded text-base"
                        placeholder="Gift description"
                      />
                      <select
                        value={editForm.contact?.id || ''}
                        onChange={(e) => {
                          const contact = contacts.find(c => c.id === parseInt(e.target.value));
                          setEditForm(prev => ({ ...prev, contact: contact || null }));
                        }}
                        className="w-full p-3 border border-gray-300 rounded text-base"
                      >
                        <option value="">No contact match</option>
                        {contacts.map(contact => (
                          <option key={contact.id} value={contact.id}>{contact.name}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="flex-1 p-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
                          Save Changes
                        </button>
                        <button onClick={cancelEdit} className="p-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-lg">{gift.gifter}</p>
                        <p className="text-gray-600">{gift.gift}</p>
                        {gift.contact && (
                          <div className="mt-2 inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            ✓ {gift.contact.name}
                            {gift.contact.phone && ` • ${gift.contact.phone}`}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(gift)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded active:scale-95"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteGift(gift.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded active:scale-95"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow text-sm text-gray-600">
          <p className="font-semibold mb-2">📱 Quick Start:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Add or import contacts (helps with auto-matching)</li>
            <li>Tap the mic and say: "Sarah gave us a blanket"</li>
            <li>AI automatically organizes gifter + gift</li>
            <li>Export as CSV for thank you cards</li>
          </ol>
          <p className="mt-3 text-xs text-gray-500">💡 Install this app to your home screen for offline use!</p>
        </div>
      </div>
    </div>
  );
}