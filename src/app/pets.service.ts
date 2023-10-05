import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

export interface PetsData {
  Total: number;
  Hostname: string;
  Hostnames: HostnamesEntity[];
  Pets: PetsEntity[];
}
export interface HostnamesEntity {
  Service: string;
  Hostname: string;
}
export interface PetsEntity {
  Index: number;
  Name: string;
  Type: string;
  Kind: string;
  Age: number;
  URL: string;
  Hostname: string;
  URI: string;
}

export interface PetsConfig {
  kind: string;
  url: string;
  driver: string;
  hostname: string;
}

@Injectable({
  providedIn: "root",
})
export class PetsService {
  constructor(private http: HttpClient) {}

  public getPetsData(url: string): Observable<PetsData> {
    console.log("getPetsData " + url);
    if (url == "/") {
      return this.http.get<PetsData>("/pets");
    } else {
      return this.http.get<PetsData>(url + "/pets");
    }
  }

  public getPet(url: string): Observable<PetsEntity> {
    return this.http.get<PetsEntity>(url);
  }

  public getConfig(url: string): Observable<PetsConfig[]> {
    console.log("getConfig /pets/config");
    if (url == "/") {
      return this.http.get<PetsConfig[]>("/pets/config");
    } else {
      return this.http.get<PetsConfig[]>(url + "/pets/config");
    }
  }

  public getPets(urls: string[]): Observable<PetsEntity[]> {
    // firstly, start out with an array of observable arrays
    const observables: Observable<PetsEntity>[] = urls.map((url) =>
      this.getPet(url)
    );
    // run all observables in parallel with forkJoin
    return forkJoin(observables).pipe(
      // now map the array of arrays to a flattened array
      map((pets) => pets)
    );
  }
}
