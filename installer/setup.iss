; Installer Variables
#define AppName "Muon"
#define AppVersion "Beta 0.0.0.5"
#define AppPublisher "Colossity"
#define AppURL "https://github.com/zachatrocity/Muon"
#define AppExeName "Muon.exe"


[Setup]
; DON'T MESS WITH THE APPID. This uniquely identifies this application, which is used to find the app if we need to update it.
AppId={{278de62b-57f5-4121-b710-7ddf1065ec49}

AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher={#AppPublisher}
AppPublisherURL={#AppURL}
AppSupportURL={#AppURL}
AppUpdatesURL={#AppURL}

; Make the Installer nicer and Minimalistic
WizardImageFile=.\muon.bmp
WizardSmallImageFile=.\smallmuon.bmp
WindowResizable=no

; Don't ask for a install folder (it goes into \Users\Username\AppData\Roaming\Muon\, which doesn't require admin privileges)
UsePreviousAppDir=no
DefaultDirName={userappdata}\Muon
DisableDirPage=yes


; No Start Menu Folder picker (It's always created)
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes

; We just need a Welcome Page and a Finish page. Nothing else.
DisableReadyPage=yes
DisableFinishedPage=no
DisableWelcomePage=no

; No UAC crap
PrivilegesRequired=none
; Put the uninstaller in the same folder, or else it'll go into Program Files, which requires Admin Privileges
UninstallFilesDir={pf}\Muon

; Use the same language as the user (or ask otherwise)
ShowLanguageDialog=auto

; Compress the files nicely
Compression=lzma2
SolidCompression=yes

; Final Installer
OutputBaseFilename=MuonInstaller_{#AppVersion}
SetupIconFile=..\images\muonIcon.ico
OutputDir=.\


[Languages]
Name: "en"; MessagesFile: ".\English.isl"


[Files]
Source: "..\build\Muon\win32\locales"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\build\Muon\win32\pdf.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\build\Muon\win32\nw.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\build\Muon\win32\Muon.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\build\Muon\win32\libGLESv2.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\build\Muon\win32\libEGL.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\build\Muon\win32\icudtl.dat"; DestDir: "{app}"; Flags: ignoreversion
Source: ".\ffmpegsumo.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\build\Muon\win32\d3dcompiler_47.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\images\muonIcon.ico"; DestDir: "{app}"; Flags: ignoreversion
; NOTE: Don't use "Flags: ignoreversion" on any shared system files


[Icons]
; Add an Icon in the app folder as a reference
Name: "{app}\{#AppName}"; WorkingDir: "{app}"; Filename: "{app}\Muon.exe"; Parameters:"""{app}\app"""; IconFilename: "{app}\muonIcon.ico"; Flags: runminimized preventpinning
; Another in the group (this one can be featured)
Name: "{group}\{#AppName}"; WorkingDir: "{app}"; Filename: "{app}\Muon.exe"; Parameters:"""{app}\app"""; IconFilename: "{app}\muonIcon.ico"; Flags: runminimized
; Another in the desktop
Name: "{commondesktop}\{#AppName}"; WorkingDir: "{app}"; Filename: "{app}\Muon.exe"; Parameters:"""{app}\app"""; IconFilename: "{app}\muonIcon.ico"; Flags: runminimized preventpinning

[Run]
; Run the app after installing
Filename: "{app}\Muon.exe"; Description: "{cm:LaunchProgram,{#StringChange(AppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent runminimized

[Code]

var
  OptionPage: TInputOptionWizardPage;

procedure InitializeWizard();
begin
  OptionPage :=
    CreateInputOptionPage(
      wpWelcome,
      'Choose installation options', 'Who should this application be installed for?',
      'Please select whether you wish to make this software available for all users or just yourself.',
      True, False);

  OptionPage.Add('&Anyone who uses this computer');
  OptionPage.Add('&Only for me');

  if IsAdminLoggedOn then
  begin
    OptionPage.Values[0] := True;
  end
    else
  begin
    OptionPage.Values[1] := True;
    OptionPage.CheckListBox.ItemEnabled[0] := False;
  end;
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  if CurPageID = OptionPage.ID then
  begin
    if OptionPage.Values[1] then
    begin
      // override the default installation to program files ({pf})
      WizardForm.DirEdit.Text := ExpandConstant('{userappdata}\Muon')
    end
      else
    begin
      WizardForm.DirEdit.Text := ExpandConstant('{pf}\Muon');
    end;
  end;
  Result := True;
end;