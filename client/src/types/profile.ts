export type UserProfile = {
  id?: string;
  userId?: string;
  nameEnglish: string;
  nameBangla?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  nationality?: string;
  religion?: string;
  gender?: string;
  birthRegistration?: string;
  nationalId?: string;
  maritalStatus?: string;
  mobileNumber?: string;
  email?: string;

  // Present Address
  presentDivision?: string;
  presentDistrict?: string;
  presentArea?: string;
  presentLocation?: string;
  presentHouse?: string;
  presentUpazila?: string;
  presentPoliceStation?: string;
  presentPostOffice?: string;
  presentPostCode?: string;

  // Permanent Address
  permanentDivision?: string;
  permanentDistrict?: string;
  permanentUpazila?: string;
  permanentUnion?: string;
  permanentVillage?: string;
  permanentPostOffice?: string;
  permanentPoliceStation?: string;
  permanentPostCode?: string;

  presentAddress?: string;
  permanentAddress?: string;
  bioSummary?: string;
  educationDetailsJson?: string;
  codingProfilesJson?: string;
};
