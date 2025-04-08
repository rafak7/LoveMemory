import React, { useState, useEffect } from 'react';
import { Heart, Plus, Music, Image, MessageCircleHeart, QrCode, Trash2, X, Download, ExternalLink, Eye } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { memoriesApi, Memory as FirebaseMemory } from '../config/firebase';

interface SpotifyTrack {
  name: string;
  artists: string[];
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
}

interface Memory extends Omit<FirebaseMemory, 'photos'> {
  photos: File[];
  photoUrls?: string[];
  musicUrl?: string;
  musicData?: SpotifyTrack;
  description: string;
}

interface NewMemory {
  title?: string;
  description?: string;
  musicUrl?: string;
}

const Dashboard = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newMemory, setNewMemory] = useState<NewMemory>({});
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedMemoryForQR, setSelectedMemoryForQR] = useState<Memory | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);

  const CLIENT_ID = 'dd0ba542bcbf48d4ae60fd5149ac090e';
  const CLIENT_SECRET = '6f15f6bcbdb140e4887b77e77bb513ba';

  // Carregar memórias ao montar o componente
  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const userId = "user123"; // TODO: Implementar autenticação
      const firebaseMemories = await memoriesApi.getByUserId(userId);
      console.log('Memórias carregadas do Firebase:', firebaseMemories);
      
      // Converter as memórias do Firebase para o formato local
      const convertedMemories = firebaseMemories.map(memory => ({
        ...memory,
        photos: [], // Mantemos o array de File vazio
        photoUrls: memory.photoUrls || [], // Usamos as URLs armazenadas
      }));

      setMemories(convertedMemories);
    } catch (error) {
      console.error('Erro ao carregar memórias:', error);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedPhotos(Array.from(e.target.files));
    }
  };

  const getSpotifyToken = async () => {
    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        throw new Error('Falha ao obter token do Spotify');
      }

      const data = await tokenResponse.json();
      return data.access_token;
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  };

  const getTrackId = (url: string) => {
    const trackMatch = url.match(/spotify\.com(?:\/intl-[a-z]+)?\/track\/([a-zA-Z0-9]+)/);
    return trackMatch ? trackMatch[1] : null;
  };

  const fetchSpotifyTrackData = async (url: string): Promise<SpotifyTrack | null> => {
    setIsLoadingMusic(true);
    try {
      const trackId = getTrackId(url);
      if (!trackId) {
        console.error('ID da música não encontrado na URL:', url);
        return null;
      }

      console.log('Obtendo token do Spotify...');
      const token = await getSpotifyToken();
      if (!token) {
        console.error('Não foi possível obter o token do Spotify');
        return null;
      }
      console.log('Token obtido com sucesso');

      console.log('Fazendo requisição para a API do Spotify...');
      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', response.status, errorText);
        throw new Error(`Falha ao buscar dados da música: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados recebidos da API:', data);

      return {
        name: data.name,
        artists: data.artists.map((artist: { name: string }) => artist.name),
        album: {
          name: data.album.name,
          images: data.album.images,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar dados da música:', error);
      return null;
    } finally {
      setIsLoadingMusic(false);
    }
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userId = "user123";
      let musicData = null;

      if (newMemory.musicUrl) {
        console.log('Buscando dados da música:', newMemory.musicUrl);
        musicData = await fetchSpotifyTrackData(newMemory.musicUrl);
        console.log('Dados da música obtidos:', musicData);
      }
      
      // Primeiro criar a memória para obter o ID
      const newMemoryData = {
        title: newMemory.title || '',
        description: newMemory.description || '',
        date: new Date().toISOString(),
        userId,
        createdAt: Date.now(),
        musicUrl: newMemory.musicUrl || '',
        ...(musicData ? { musicData } : {}),
      };

      console.log('Criando nova memória:', newMemoryData);
      const createdMemory = await memoriesApi.create(newMemoryData);
      
      // Upload das fotos e obtenção das URLs
      const photoUrls = await Promise.all(
        selectedPhotos.map((file, index) => 
          memoriesApi.uploadPhoto(file, createdMemory.id!, index)
        )
      );

      // Atualizar a memória com as URLs das fotos
      await memoriesApi.update(createdMemory.id!, { photoUrls });

      setMemories(prevMemories => [{
        ...createdMemory,
        photos: selectedPhotos,
        photoUrls,
        description: newMemoryData.description,
        musicUrl: newMemoryData.musicUrl,
        musicData: musicData || undefined,
      } as Memory, ...prevMemories]);

      setIsCreating(false);
      setNewMemory({});
      setSelectedPhotos([]);
    } catch (error) {
      console.error('Erro ao criar memória:', error);
      alert('Erro ao criar memória. Por favor, tente novamente.');
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await memoriesApi.delete(id);
      setMemories(prevMemories => prevMemories.filter(memory => memory.id !== id));
    } catch (error) {
      console.error('Erro ao deletar memória:', error);
      alert('Erro ao deletar memória. Por favor, tente novamente.');
    }
  };

  const handleGenerateQR = async (memory: Memory) => {
    console.log('Gerando QR Code para memória:', memory);
    
    // Se tiver URL da música mas não tiver os dados, buscar
    if (memory.musicUrl && !memory.musicData) {
      console.log('Buscando dados da música para QR Code:', memory.musicUrl);
      const musicData = await fetchSpotifyTrackData(memory.musicUrl);
      if (musicData) {
        console.log('Dados da música obtidos:', musicData);
        memory = { ...memory, musicData };
        
        // Atualizar a memória no Firebase também
        try {
          await memoriesApi.update(memory.id!, { musicData });
          console.log('Dados da música atualizados no Firebase');
        } catch (error) {
          console.error('Erro ao atualizar dados da música no Firebase:', error);
        }
        
        // Atualizar a memória na lista local
        setMemories(prevMemories => 
          prevMemories.map(m => m.id === memory.id ? memory : m)
        );
      }
    }
    
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
  const getSpotifyEmbedUrl = (url: string | undefined) => {
    if (!url) return undefined;
    
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
    
    return undefined;
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Mensagem Especial
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Escreva uma mensagem carinhosa..."
                  value={newMemory.description || ''}
                  onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
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
                <button 
                  onClick={() => handleDeleteMemory(memory.id!)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MessageCircleHeart className="h-4 w-4" />
                  <p className="line-clamp-2">{memory.description}</p>
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
                    
                    {((selectedMemoryForQR.photos && selectedMemoryForQR.photos.length > 0) || 
                      (selectedMemoryForQR.photoUrls && selectedMemoryForQR.photoUrls.length > 0)) && (
                      <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                        <img
                          src={selectedMemoryForQR.photoUrls?.[currentPhotoIndex] || 
                               URL.createObjectURL(selectedMemoryForQR.photos[currentPhotoIndex])}
                          alt={`Foto ${currentPhotoIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {((selectedMemoryForQR.photos?.length || 0) + (selectedMemoryForQR.photoUrls?.length || 0) > 1) && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {Array.from({ length: (selectedMemoryForQR.photos?.length || 0) + (selectedMemoryForQR.photoUrls?.length || 0) }).map((_, index) => (
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
                        {selectedMemoryForQR.description}
                      </p>
                    </div>

                    {selectedMemoryForQR.musicUrl && (
                      <div className="bg-purple-900/30 rounded-xl p-4 space-y-4">
                        <div className="flex items-center gap-4">
                          {isLoadingMusic ? (
                            <div className="w-16 h-16 rounded-lg bg-purple-900/50 animate-pulse" />
                          ) : selectedMemoryForQR.musicData?.album.images[0] ? (
                            <img 
                              src={selectedMemoryForQR.musicData.album.images[0].url}
                              alt="Capa do álbum"
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-purple-900/50 flex items-center justify-center">
                              <Music className="h-8 w-8 text-purple-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h5 className="text-lg font-semibold text-white">
                              {isLoadingMusic ? (
                                <div className="h-6 w-32 bg-purple-900/50 rounded animate-pulse" />
                              ) : selectedMemoryForQR.musicData?.name || 'Música adicionada'}
                            </h5>
                            {selectedMemoryForQR.musicData && (
                              <p className="text-sm text-gray-400">
                                {selectedMemoryForQR.musicData.artists.join(', ')}
                              </p>
                            )}
                          </div>
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
                              src={getSpotifyEmbedUrl(selectedMemoryForQR.musicUrl)}
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