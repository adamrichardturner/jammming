import './App.css';
import React from 'react';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '.././Playlist/Playlist';
import { SearchBar } from '.././SearchBar/SearchBar';
import Spotify from '../../util/Spotify';

Spotify.getAccessToken();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    }
  }
  
  addTrack(track) {
    if (!this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      this.setState(prevState => ({
        playlistTracks: [...prevState.playlistTracks, track]
      }));
    }
  }

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris);
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName('My playlist');
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  search(term) {
    Spotify.search(term)
    .then(searchResults => this.setState({
      searchResults: searchResults
    }));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar 
          onSearch={this.search}
          />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist 
            playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks} 
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
