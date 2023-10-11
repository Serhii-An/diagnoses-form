import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDiagnosis } from '../shared/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosesDataService {

  constructor(private http: HttpClient) {};

  getDiagnoses(searchStr?: string): Observable<Array<IDiagnosis>> {
    return this.http.get<Array<IDiagnosis>>(`/Dictionaries/icpc2?IsPublic=true${searchStr ? '&Search=' + searchStr : ''}`);
  }
}
