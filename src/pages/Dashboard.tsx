import React, { useState } from 'react';
import { Heart, Plus, Music, Image, MessageCircleHeart, QrCode, Trash2, X, Download, Eye, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Memory {
  id: string;
  title: string;
  message: string;
  photos: File[];
  musicUrl?: string;
  createdAt: Date;
}

const Dashboard = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newMemory, setNewMemory] = useState<Partial<Memory>>({});
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedMemoryForQR, setSelectedMemoryForQR] = useState<Memory | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedPhotos(Array.from(e.target.files));
    }
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    const memory: Memory = {
      id: Date.now().toString(),
      title: newMemory.title || '',
      message: newMemory.message || '',
      photos: selectedPhotos,
      musicUrl: newMemory.musicUrl,
      createdAt: new Date()
    };
    setMemories([memory, ...memories]);
    setIsCreating(false);
    setNewMemory({});
    setSelectedPhotos([]);
  };

  const handleGenerateQR = (memory: Memory) => {
    setSelectedMemoryForQR(memory);
    setShowPreview(true);
    setCurrentPhotoIndex(0);
  };

  const handleDownloadQR = () => {
    if (!selectedMemoryForQR) return;

    const canvas = document.querySelector('#qr-code-preview canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${selectedMemoryForQR.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseModal = () => {
    setSelectedMemoryForQR(null);
    setShowPreview(true);
    setCurrentPhotoIndex(0);
  };

  // Função para extrair o ID da música do Spotify
  const getSpotifyEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Para URLs de música do Spotify
    const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}`;
    }
    
    // Para URLs de playlist do Spotify
    const playlistMatch = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
    if (playlistMatch) {
      return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}`;
    }
    
    return null;
  };

  // Função para extrair o título da música da URL do Spotify
  const getSpotifyTitle = (url: string) => {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      // Remove caracteres especiais e substitui hífens por espaços
      const title = pathParts[pathParts.length - 1].replace(/-/g, ' ');
      // Capitaliza a primeira letra de cada palavra
      return title.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    } catch {
      return 'Música do Spotify';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Minhas Memórias
            </h1>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Nova Memória
          </button>
        </div>

        {isCreating ? (
          <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/10 p-6 mb-8">
            <form onSubmit={handleCreateMemory} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Título da Memória
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ex: Nosso primeiro encontro"
                  value={newMemory.title || ''}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Mensagem Especial
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Escreva uma mensagem carinhosa..."
                  value={newMemory.message || ''}
                  onChange={(e) => setNewMemory({ ...newMemory, message: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="photos" className="block text-sm font-medium text-gray-300 mb-2">
                  Fotos
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg cursor-pointer hover:bg-purple-900/40 transition-colors">
                    <Image className="h-5 w-5" />
                    Escolher fotos
                    <input
                      type="file"
                      id="photos"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />
                  </label>
                  <span className="text-sm text-gray-400">
                    {selectedPhotos.length} foto(s) selecionada(s)
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="music" className="block text-sm font-medium text-gray-300 mb-2">
                  Link da Música (Spotify/YouTube)
                </label>
                <input
                  type="url"
                  id="music"
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://open.spotify.com/track/..."
                  value={newMemory.musicUrl || ''}
                  onChange={(e) => setNewMemory({ ...newMemory, musicUrl: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                >
                  Criar Memória
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2 bg-purple-900/30 border border-purple-500/20 rounded-full hover:bg-purple-900/40 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/10 p-6 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">{memory.title}</h3>
                <button className="text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MessageCircleHeart className="h-4 w-4" />
                  <p className="line-clamp-2">{memory.message}</p>
                </div>

                {memory.photos.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Image className="h-4 w-4" />
                    <p>{memory.photos.length} foto(s)</p>
                  </div>
                )}

                {memory.musicUrl && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Music className="h-4 w-4" />
                    <p className="truncate">Música adicionada</p>
                  </div>
                )}

                <button 
                  onClick={() => handleGenerateQR(memory)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300 mt-4"
                >
                  <QrCode className="h-5 w-5" />
                  Gerar QR Code
                </button>
              </div>
            </div>
          ))}
        </div>

        {memories.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma memória criada</h3>
            <p className="text-gray-400 mb-6">
              Comece criando sua primeira memória romântica para gerar um QR Code especial.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
              Criar Primeira Memória
            </button>
          </div>
        )}

        {/* Modal do QR Code */}
        {selectedMemoryForQR && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl border border-purple-500/10 p-6 max-w-3xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">QR Code da Memória</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div id="qr-code-preview" className="bg-white p-4 rounded-xl mb-6">
                    <QRCodeSVG
                      value={`${window.location.origin}/memory/${selectedMemoryForQR.id}`}
                      size={200}
                      level="H"
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-300">
                      Escaneie este QR Code para acessar a memória "{selectedMemoryForQR.title}"
                    </p>
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={handleDownloadQR}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                      >
                        <Download className="h-5 w-5" />
                        Baixar QR Code
                      </button>
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-900/30 border border-purple-500/20 rounded-full hover:bg-purple-900/40 transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                        {showPreview ? 'Ocultar Preview' : 'Ver Preview'}
                      </button>
                    </div>
                  </div>
                </div>

                {showPreview && (
                  <div className="md:w-2/3 bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/10 p-6">
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-6">
                      {selectedMemoryForQR.title}
                    </h4>
                    
                    {selectedMemoryForQR.photos.length > 0 && (
                      <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(selectedMemoryForQR.photos[currentPhotoIndex])}
                          alt={`Foto ${currentPhotoIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {selectedMemoryForQR.photos.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {selectedMemoryForQR.photos.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentPhotoIndex(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                  index === currentPhotoIndex
                                    ? 'bg-white'
                                    : 'bg-white/50 hover:bg-white/75'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="bg-purple-900/30 rounded-xl p-6 mb-6">
                      <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                        {selectedMemoryForQR.message}
                      </p>
                    </div>

                    {selectedMemoryForQR.musicUrl && (
                      <div className="bg-purple-900/30 rounded-xl p-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <Music className="h-5 w-5 text-purple-400" />
                          <h5 className="text-lg font-semibold text-white flex-1">
                            {getSpotifyTitle(selectedMemoryForQR.musicUrl)}
                          </h5>
                          <a
                            href={selectedMemoryForQR.musicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Abrir no Spotify
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        
                        {getSpotifyEmbedUrl(selectedMemoryForQR.musicUrl) && (
                          <div className="rounded-xl overflow-hidden">
                            <iframe
                              src={getSpotifyEmbedUrl(selectedMemoryForQR.musicUrl) || ''}
                              width="100%"
                              height="80"
                              frameBorder="0"
                              allow="encrypted-media"
                              className="border-0"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;