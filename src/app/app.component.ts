import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DiagnosesDataService } from './shared/diagnoses-data.service';
import { IDiagnosis } from './shared/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private diagnosesDataService: DiagnosesDataService, private fb: FormBuilder) {}
  resultJSON: Object | null = null;
  diagnosesList: Array<IDiagnosis> = [];
  searchParam: string = 'Ост';
  diagnosesForm: FormGroup = this.fb.group({
    date: new FormControl('', [Validators.required, this.dateValidator()]),
    diagnoses: this.fb.array([]),
  });

  get diagnoses(): FormArray {
    return this.diagnosesForm.get("diagnoses") as FormArray;
  }


  addDiagnosis(): void {
    this.diagnoses.push(this.newDiagnosis());
  }


  newDiagnosis(): FormGroup {
    return this.fb.group({
      diagnosis: '',
      comment: '',
    })
  }
  

  ngOnInit() { 
    this.addDiagnosis();

    this.diagnosesDataService.getDiagnoses(this.searchParam).subscribe((data: Array<IDiagnosis>) => {
      this.diagnosesList = [...data];
    });
  }


  public onSubmit(): void {
    this.resultJSON = JSON.stringify({
      "encounter": {
        "date" : this.diagnosesForm.controls.date.value.toISOString()
      },
      
      "conditions": this.getConditionsArray()
    }, null, " ");
  }


  getConditionsArray(): Array<Object> {
    const json: Array<Object> = [];

    (this.diagnosesForm.get('diagnoses') as FormArray).controls.forEach((diagnosis) => {
      const diagnosisId: string = diagnosis.get('diagnosis')?.value;
      if (!diagnosisId) {
        return;
      }

      json.push(
        {
          "id": "f8525994-03ec-446e-83bf-4208c2f8aee3",        
          "context": {
              "identifier": {
                  "type": {
                      "coding": [
                          {
                              "system": "eHealth/resources",
                              "code": "encounter"
                          }
                      ]
                  },
                  "value": diagnosisId
              }
          },
          "code": {
              "coding": [
                  {
                      "system": "eHealth/ICPC2/condition_codes",
                      "code": this.findCodeById(parseInt(diagnosisId))
                  }
              ]
          },
          "notes": diagnosis.get('comment')?.value,	
          "onset_date": "2023-10-05T15:01:31.375Z"        
        }
      );
    });

    return json;
  }


  findCodeById(id: number): string {
    const choosenDiagnosis = this.diagnosesList.find(el => el.id === id);

    return choosenDiagnosis!.code;
  }


  dateValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
      const newValue = new Date(control.value).toLocaleDateString();
      const todayDate = new Date().toLocaleDateString();

      if (!newValue) {
        return null;
      }

      const isDatedValid = todayDate <= newValue;
      return !isDatedValid ? {invalidDate: true} : null;
    }
  } 
}