import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, Inject } from "@angular/core";

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
})
export class TestComponent {

    title = 'drive';

    // Replace with your own Browser API key, or your own key.
    developerKey = 'AIzaSyDevoI-R9OKzfBJFGT5DQengL4OncVncvI';

    // The Client ID obtained from the Google API Console. Replace with your own Client ID.
    clientId = "506975608098-n9044b103auhrd7hu2iorb933i0i1o9u.apps.googleusercontent.com"

    // Replace with your own project number from console.developers.google.com.
    // See "Project number" under "IAM & Admin" > "Settings"
    appId = "gg-drive-angular";

    // Scope to use to access user's Drive items.
    scope = ['https://www.googleapis.com/auth/drive'];

    pickerApiLoaded = false;
    oauthToken;

    constructor(
        private aa: ChangeDetectorRef

    ) { }

    // Use the Google API Loader script to load the google.picker script.
    async loadPicker() {
        gapi.load('auth', { 'callback': this.onAuthApiLoad.bind(this) });
        //gapi.load('picker', { 'callback': this.onPickerApiLoad.bind(this) });
    }



    onAuthApiLoad() {
        gapi.auth.authorize(
            {
                'client_id': this.clientId,
                'scope': this.scope,
                'immediate': false
            },
            this.handleAuthResult.bind(this));

    }


    onPickerApiLoad() {
        this.pickerApiLoaded = true;
        this.createPicker();
    }

    handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
            this.oauthToken = authResult.access_token;
            // this.createPicker();
            gapi.load('picker', { 'callback': this.onPickerApiLoad.bind(this) });

            console.log(gapi.auth.getToken());

        }
    }

    oor

    // Create and render a Picker object for searching images.
    mitype = `
    application/pdf,
    application/msword,
    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
    application/vnd.ms-powerpoint,
    application/vnd.openxmlformats-officedocument.presentationml.presentation,
    application/vnd.oasis.opendocument.text,
    text/plain,
    application/vnd.oasis.opendocument.text
    `;
    createPicker() {

        if (this.oauthToken) {
            const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
            view.setMimeTypes(this.mitype.replace(/\s/g, ''));
            const picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                // .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setAppId(this.appId)
                .setOAuthToken(this.oauthToken)
                .addView(view)
                .addView(new google.picker.DocsUploadView())
                .setDeveloperKey(this.developerKey)
                .setCallback(this.pickerCallback.bind(this))
                .build();
            picker.setVisible(true);
        }

    }

    my = ''

    // A simple callback implementation.
    async pickerCallback(data) {
        if (data.action == google.picker.Action.PICKED) {
            this.fileData = data.docs[0];
            this.my = data.docs[0].url;

            // await gapi.auth.signOut()
            const index = this.my.lastIndexOf('/');
            this.my = this.my.substring(0, index + 1) + "preview"
            this.aa.detectChanges()
            console.log(data.docs[0])
        }
    }

    fileData: any

    download() {

        gapi.client.drive.files.get({
            fileId: this.fileData.id,
            alt: "media"
        }).then(function (res) {

            // In this case, res.body is the binary data of the downloaded file.
            console.log(res);


        });

        // var request = gapi.client.request({
        //     'path': '/drive/v2/files',
        //     'method': 'GET',
        //     'params': {'maxResults': '1'}
        //     });


    }

} 