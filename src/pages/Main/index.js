import React, { Component } from 'react';
import api from '../../api/api';
import { Container } from './styles';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
    };
  }

  async componentDidMount() {
    const res = await api.get();

    //Groups the pictures in albums by albumId
    const results = res.data.reduce(function (results, album) {
      (results[album.albumId] = results[album.albumId] || []).push(album);
      return results;
    }, {});

    //Gets the last 3 albums
    const albums = Object.entries(results).slice(
      Math.max(Object.keys(results).length - 3, 0)
    );

    //Gets the last 2 pictures of the last 3 albums, ordering the pictures by ID
    const pictures = [];
    albums.forEach(([key, value]) => {
      const order = value.sort(function (a, b) {
        let comparison = 0;
        if (a.id > b.id) {
          comparison = 1;
        } else if (a.id > b.id) {
          comparison = -1;
        }
        return comparison;
      });
      pictures.push(order.slice(Math.max(order.length - 2, 0)));
    });

    this.setState({ albums: pictures });
  }

  render() {
    const { albums } = this.state;
    return (
      <div>
        {albums.map((album, index) => (
          <Container key={index}>
            {album.map((a) => (
              <div key={a.id}>
                <h3>{a.title}</h3>
                <img alt={a.title} src={a.thumbnailUrl} />
              </div>
            ))}
          </Container>
        ))}
      </div>
    );
  }
}
