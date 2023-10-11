import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDiagnosis } from '../shared/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosesDataService {

  constructor(private http: HttpClient) {};

  baseUrl = 'http://localhost:3000';

  getDiagnoses(searchStr: string): Observable<Array<IDiagnosis>> {
    return this.http.get<Array<IDiagnosis>>(`${this.baseUrl}/diagnoses?IsPublic=true&Search=${searchStr}`);
  }
}
