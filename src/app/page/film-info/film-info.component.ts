import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta} from '@angular/platform-browser';

import { StarRatingComponent } from '../../page-component/star-rating/star-rating.component';
import { ComentariesComponent } from '../../page-component/comentaries/comentaries.component';

import { FilmInfoService } from '../../service/film-info/film-info.service';
import { DataOperationService } from '../../service/dataOperation/data-operation.service';



@Component({
  selector: 'app-film-info',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, ComentariesComponent],
  templateUrl: './film-info.component.html',
  styleUrl: './film-info.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FilmInfoComponent implements OnInit {

  userLocalInfo: any; // Інформація про користувача з localStarage
  userStorageInfo: any; // Інформація про користувача з бази даних

  filmId: string = ''; // Айді фільму
  filmInfo: any; // Усі данні про фільм
  trelerId: any; // Айді трейлера на ютубі

  raiting: number = 0; // Оцінка яку виставив користувач

  listDisplay: boolean = false; // Відображує блок з переіком доступник списків при true
  myLists: any = []; // Масив з саписками

  loadding: boolean = false; // Лоадер 
  userLoadded: string = 'false'; // Вказує чи увішов користувач в акаунт

  message: string = ''; // Повідомлення яке виводиться на сторінку і певні моменти

  constructor(
    private route: ActivatedRoute,
    private FilmInfoService: FilmInfoService,
    private dataOperationService: DataOperationService,
    private meta: Meta,
  ) { }
  

  ngOnInit(): void {

    this.loadding = true;

    this.route.paramMap.subscribe((params) => {

      this.filmId = params.get('id') ?? '';

    });

    this.getInfo() 
    this.getFilmTriler();
    this.getFilmInfo();

    this.loadding = false;
  }

  // Отримання локальнії інформації 

  getInfo() {

    if (typeof window !== 'undefined' && window.localStorage) {

      this.userLoadded = localStorage.getItem('logged') || '';

     if (this.userLoadded == 'true') {

      let localInfo = localStorage.getItem('userInfo') || '';
      this.userLocalInfo = JSON.parse(localInfo);

      this.dataOperationService.getUserInfo(this.userLocalInfo.email).subscribe( response => {

        if (response) {
  
          this.userStorageInfo = response.exists;
          
          for (let list of this.userStorageInfo.lists) {

            let foundList = {
              listName: list.listName,
              filmFound: false
            }

            for (let film of list.listFilms) {

              if (film.id == this.filmId) {
                foundList.filmFound = true;
                this.myLists.push(foundList);
                
                return

              }

            }

            if (foundList.filmFound == false) {
              this.myLists.push(foundList);
            }
            
          }
  
        }
  
      })

     }

    }
  }

  // Отримання інформації про фільмів

  getFilmInfo(): void {

    this.FilmInfoService.getFilmInfo(this.filmId).subscribe((data) => {

      this.filmInfo = data;
      this.meta.updateTag({ name: 'description', content: `${this.filmInfo.Plot}` });

    });

  }

  // Отримання трейлеру фільму

  getFilmTriler() {

    const imdbID = this.filmId;
    const apiKey = '43bf190d6bcf679c19972989b9cb1774';
    let api = `https://api.themoviedb.org/3/movie/${imdbID}/videos?api_key=${apiKey}`;

    fetch(api)
      .then((response) => response.json())
      .then((data) => {

        let trailers;

        if(data.results) {

          trailers = data.results.filter((video: { type: string; }) => video.type === 'Trailer');

        } else {

          trailers = '';

        }

        if(trailers) {

          this.trelerId =  trailers[0].key;

        } else {

          this.trelerId ='';

        }

      })
      .catch((error) => console.error('Error:', error));

  }

  // Для оцінювання зріками

  Handle(event: number): void {
    
    this.message = `Thank you for your ${event} star rating`;
    this.raiting = event;
    

    setTimeout(() => {
      this.message = this.message.replace(this.message, '');
    }, 2800);
  }

  // Відривання та закривання списків

  handleList(): void {

    this.listDisplay = !this.listDisplay;

  }

 // Додавання в список
 
 addInList(listInfo: any):void {

  const listTitle = {
    poster: this.filmInfo.Poster,
    title: this.filmInfo.Title,
    type: this.filmInfo.Type,
    year: this.filmInfo.Year,
    id: this.filmInfo.imdbID,
  }

  for (let listStorage of this.userStorageInfo.lists) {

    if (listStorage.listName == listInfo.listName) {

      listStorage.listFilms.push(listTitle);
      this.dataOperationService.updateData(this.userLocalInfo.email,this.userStorageInfo).subscribe((response) => {});

    }

    for (let list of this.myLists) {

      if (list.listName == listInfo.listName) {

        list.filmFound = true;

      }

    }

  }

 }

 // Видалення зі списку  
 removeInList(listInfo: any):void {

  for (let listStorage of this.userStorageInfo.lists) {

    if (listStorage.listName == listInfo.listName) {

      listStorage.listFilms = listStorage.listFilms.filter((list: { id: any; }) => list.id !== this.filmId);
      this.dataOperationService.updateData(this.userLocalInfo.email,this.userStorageInfo).subscribe((response) => {});

    }

    for (let list of this.myLists) {

      if (list.listName == listInfo.listName) {

        list.filmFound = false;

      }

    }

  }

}

}