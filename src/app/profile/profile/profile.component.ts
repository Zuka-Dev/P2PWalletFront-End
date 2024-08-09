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

  isChangePasswordModalOpen = false;
  isCreatePinModalOpen = false;
  isChangePinModalOpen = false;
  isSecurityModalOpen = false;
  isSecurityAnswerModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initForms();
    this.isLoading = true;
    this.loadSecurityQuestions();
    this.loadUserProfile();
    this.isLoading = false;
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
      newPin: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(6)],
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
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      image: [''],
    });
  }

  loadSecurityQuestions() {
    this.profileService.getSecurityQuestions().subscribe((questions) => {
      console.log('questions', questions);
      this.securityQuestions = questions.data;
    });
  }

  loadUserProfile() {
    this.userService.getUserDetails().subscribe((profile) => {
      this.userDetails = profile;
      this.profileForm.patchValue(profile);
    });
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      const changePasswordDto: ChangePasswordDTO = {
        oldPassword: this.passwordForm.get('oldPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value,
      };

      this.profileService.changePassword(changePasswordDto).subscribe(() => {
        this.showToastMessage('Password changed successfully', 'success');
        // Handle successful password change
        this.closeChangePasswordModal();
      });
    }
  }
  onCreateSecurityQuestion() {
    if (this.securityQuestionsForm.valid) {
      console.log(this.securityQuestionsForm.get('newSecurityQuestion')?.value);
      const securityQuestion: SecurityAnswer = {
        securityQuestionId: Number(
          this.securityQuestionsForm.get('newSecurityQuestion')?.value
        ),
        securityA: this.securityQuestionsForm.get('newSecurityAnswer')?.value,
      };
      console.log(securityQuestion);
      this.profileService.postSecurityAnswer(securityQuestion).subscribe(() => {
        this.showToastMessage(
          'Security question added successfully',
          'success'
        );
        // Handle successful security question creation
        this.closeSecurityModal();
      });
    }
  }
  
  onCheckSecurityAnswer() {
    this.profileService
      .checkSecurityAnswer({
        securityA: this.checkSecurityForm.get('securityAnswer')?.value,
      })
      .subscribe((res) => {
        if (!res.status) {
          this.showToastMessage('Security answer is wrong', 'error');
          this.isSecurityAnswerCorrect = false;
        }
        this.isSecurityAnswerCorrect = res.status;
      });
  }
  onCreatePin() {
    this.openSecurityModal();
    if (this.createPinForm.valid) {
      const createPinDto: CreatePinDTO = {
        pin: this.createPinForm.get('newPin')?.value,
      };

      this.profileService.createPin(createPinDto).subscribe(() => {
        this.showToastMessage('PIN created successfully', 'success');
        // Handle successful PIN creation
        this.closeCreatePinModal();
      });
    }
  }

  onChangePIN() {
    this.openSecurityAnswerModal();
    if (!this.isSecurityAnswerCorrect) {
      return;
    }
    this.closeSecurityAnswerModal();
    if (this.changePinForm.valid && this.userDetails) {
      const changePinDto: ChangePinDTO = {
        oldPin: this.changePinForm.get('oldPin')?.value,
        newPin: this.changePinForm.get('newPin')?.value,
      };
      this.profileService.changePin(changePinDto).subscribe(
        () => {
          this.isLoading = false;
          this.showToastMessage('PIN changed successfully', 'success');
          // Handle successful PIN change
          this.closeChangePinModal();
        },
        (error) => {
          this.isLoading = false;
          this.showToastMessage('Failed to change PIN', 'error');
        }
      );
    }
  }

  onUpdateProfile() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const imageBase64 = this.getBase64FromFile(formValue.image);

      const updateProfileDto: UpdateProfileDTO = {
        lastName: formValue.lastName,
        imageBase64: imageBase64,
        phone: formValue.phoneNumber,
        address: formValue.address,
      };

      this.profileService.updateProfile(updateProfileDto).subscribe(() => {
        this.showToastMessage('Profile updated successfully', 'success');
        // Handle successful profile update
      });
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
    this.profileForm.patchValue({ image: file });
  }

  getBase64FromFile(file: File): string {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    let base64String = '';
    reader.onload = () => {
      base64String = reader.result as string;
    };
    return base64String;
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
