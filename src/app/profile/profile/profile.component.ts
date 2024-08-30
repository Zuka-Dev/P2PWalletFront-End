import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { UserService } from '../../core/services/user.service';
import {
  ChangePasswordDTO,
  ChangePinDTO,
  CreatePinDTO,
  SecurityAnswer,
  SecurityQuestion,
  UpdateProfileDTO,
  UserDetails,
} from '../../../types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  isLoading: boolean = false;
  showToast: boolean = false;
  isSecurityAnswerCorrect: boolean = false;
  toastMessage: string = '';
  toastType!: 'success' | 'info' | 'error';
  passwordForm!: FormGroup;
  createPinForm!: FormGroup;
  changePinForm!: FormGroup;
  profileForm!: FormGroup;
  securityQuestionsForm!: FormGroup;
  checkSecurityForm!: FormGroup;
  securityQuestions: SecurityQuestion[] = [];
  userDetails: UserDetails | null = null;
  chosenSecurityQuestionId!: number;
  chosenSecurityQuestionData: string = ''; // Initialize to an empty string
  isChangePasswordModalOpen = false;
  isCreatePinModalOpen = false;
  isChangePinModalOpen = false;
  isSecurityModalOpen = false;
  isSecurityAnswerModalOpen = false;
  imageBase64!: string;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadSecurityQuestions();
    this.initForms();
  }

  initForms() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });

    this.securityQuestionsForm = this.fb.group({
      newSecurityQuestion: ['', Validators.required],
      newSecurityAnswer: ['', Validators.required],
    });

    this.createPinForm = this.fb.group({
      pin: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern('^[0-9]{4}$'),
        ],
      ],
    });

    this.checkSecurityForm = this.fb.group({
      securityAnswer: ['', Validators.required],
    });

    this.changePinForm = this.fb.group({
      oldPin: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(6)],
      ],
      newPin: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(6)],
      ],
    });

    this.profileForm = this.fb.group({
      lastName: [``, Validators.required],
      phoneNumber: [``, Validators.required],
      address: [``, Validators.required],
      image: [''],
    });
  }

  loadSecurityQuestions() {
    this.isLoading = true;
    this.profileService.getSecurityQuestions().subscribe(
      (questions) => {
        this.securityQuestions = questions.data;
        this.isLoading = false;
      },
      (error) => {
        this.showToastMessage('Failed to load security questions', 'error');
        this.isLoading = false;
      }
    );
  }

  loadUserProfile() {
    this.isLoading = true;
    this.userService.getUserDetails().subscribe(
      (profile) => {
        this.userDetails = profile;
        this.profileForm.patchValue(profile);
        this.isLoading = false;
      },
      (error) => {
        this.showToastMessage('Failed to load user profile', 'error');
        this.isLoading = false;
      }
    );
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      const changePasswordDto: ChangePasswordDTO = {
        oldPassword: this.passwordForm.get('oldPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value,
      };

      this.profileService.changePassword(changePasswordDto).subscribe(
        (res) => {
          if (!res.status) this.showToastMessage(res.statusMessage, 'error');
          this.showToastMessage(res.statusMessage, 'success');
          this.closeChangePasswordModal();
          this.isLoading = false;
        },
        (error) => {
          this.showToastMessage('Failed to change password', 'error');
          this.isLoading = false;
        }
      );
    }
  }

  onCreateSecurityQuestion() {
    if (this.securityQuestionsForm.valid) {
      this.isLoading = true;
      this.chosenSecurityQuestionId = Number(
        this.securityQuestionsForm.get('newSecurityQuestion')?.value
      );
      const securityQuestion: SecurityAnswer = {
        securityQuestionId: this.chosenSecurityQuestionId,
        securityA: this.securityQuestionsForm.get('newSecurityAnswer')?.value,
      };

      this.profileService.postSecurityAnswer(securityQuestion).subscribe(
        (res) => {
          if (!res.status) this.showToastMessage(res.statusMessage, 'error');
          this.showToastMessage(res.statusMessage, 'success');
          this.closeSecurityModal();
          this.isLoading = false;
        },
        (error) => {
          this.showToastMessage('Failed to add security question', 'error');
          this.isLoading = false;
        }
      );
    }
  }

  onCheckSecurityAnswer() {
    if (this.checkSecurityForm.valid) {
      this.isLoading = true;

      // Fetch the selected security question data
      this.profileService
        .getSecurityQuestionById(this.chosenSecurityQuestionId)
        .subscribe(
          (s) => {
            this.chosenSecurityQuestionData = s.data.securityQuestion;
          },
          (error) => {
            this.showToastMessage('Failed to fetch security question', 'error');
            this.isLoading = false;
          }
        );

      // Check the security answer
      this.profileService
        .checkSecurityAnswer({
          securityA: this.checkSecurityForm.get('securityAnswer')?.value,
        })
        .subscribe(
          (res) => {
            if (res.status) {
              this.showToastMessage(res.statusMessage, 'success');
              this.isSecurityAnswerCorrect = true;
              this.closeSecurityAnswerModal();
            } else {
              this.showToastMessage('Security answer is incorrect', 'error');
              this.isSecurityAnswerCorrect = false;
            }
            this.isLoading = false;
          },
          (error) => {
            this.showToastMessage('Failed to verify security answer', 'error');
            this.isLoading = false;
          }
        );
    }
  }

  onCreatePin() {
    this.openSecurityModal();
    if (this.createPinForm.valid) {
      this.isLoading = true;
      const createPinDto: CreatePinDTO = {
        pin: this.createPinForm.get('pin')?.value,
      };
      this.profileService.createPin(createPinDto).subscribe((res) => {
        if (!res.status) this.showToastMessage(res.statusMessage, 'error');
        this.showToastMessage(res.statusMessage, 'success');
        this.closeCreatePinModal();
        this.isLoading = false;
      });
    }
  }

  onChangePIN() {
    this.openSecurityAnswerModal();
    if (this.changePinForm.valid && this.userDetails) {
      this.isLoading = true;
      const changePinDto: ChangePinDTO = {
        oldPin: this.changePinForm.get('oldPin')?.value,
        newPin: this.changePinForm.get('newPin')?.value,
      };
      this.profileService.changePin(changePinDto).subscribe(
        (res) => {
          this.showToastMessage(res.statusMessage, 'success');
          this.closeChangePinModal();
          this.isLoading = false;
        },
        (error) => {
          this.showToastMessage('Failed to change PIN', 'error');
          this.isLoading = false;
        }
      );
    }
  }

  afterSecurityCheck() {
    if (!this.isSecurityAnswerCorrect) {
      this.showToastMessage(
        'Please provide the correct security answer',
        'error'
      );
      return;
    }

    this.closeSecurityAnswerModal();

    if (this.changePinForm.valid && this.userDetails) {
      this.isLoading = true;
      const changePinDto: ChangePinDTO = {
        oldPin: this.changePinForm.get('oldPin')?.value,
        newPin: this.changePinForm.get('newPin')?.value,
      };
      this.profileService.changePin(changePinDto).subscribe(
        (res) => {
          if (!res.status) this.showToastMessage(res.statusMessage, 'error');
          this.showToastMessage(res.statusMessage, 'success');
          this.closeChangePinModal();
          this.isLoading = false;
        },
        (error) => {
          this.showToastMessage('Failed to change PIN', 'error');
          this.isLoading = false;
        }
      );
    }
  }

  onUpdateProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const formValue = this.profileForm.value;

      const updateProfileDto: UpdateProfileDTO = {
        lastName: formValue.lastName,
        imageBase64: this.imageBase64,
        phone: formValue.phoneNumber,
        address: formValue.address,
      };
      console.log(this.imageBase64);
      this.profileService.updateProfile(updateProfileDto).subscribe(
        (res) => {
          if (!res.status) this.showToastMessage(res.statusMessage, 'error');
          this.showToastMessage(res.statusMessage, 'success');
          this.isLoading = false;
        },
        (error) => {
          this.showToastMessage('Failed to update profile', 'error');
          this.isLoading = false;
        }
      );
    }
  }

  showToastMessage(message: string, type: 'success' | 'info' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileForm.patchValue({ image: file });
      this.convertFileToBase64(file);
      console.log(file);
    }
  }

  convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
      console.log(this.imageBase64);
    };
    reader.readAsDataURL(file);
  }

  openChangePasswordModal() {
    this.isChangePasswordModalOpen = true;
  }

  closeChangePasswordModal() {
    this.isChangePasswordModalOpen = false;
  }

  openCreatePinModal() {
    this.isCreatePinModalOpen = true;
  }

  closeCreatePinModal() {
    this.isCreatePinModalOpen = false;
  }

  openChangePinModal() {
    this.isChangePinModalOpen = true;
  }

  closeChangePinModal() {
    this.isChangePinModalOpen = false;
  }

  openSecurityModal() {
    this.isSecurityModalOpen = true;
  }

  closeSecurityModal() {
    this.isSecurityModalOpen = false;
  }

  openSecurityAnswerModal() {
    this.isSecurityAnswerModalOpen = true;
  }

  closeSecurityAnswerModal() {
    this.isSecurityAnswerModalOpen = false;
  }
}
