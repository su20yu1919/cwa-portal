## Introduction

Welcome to the CWA Aquahacking portal. This portal is developed by DigitalC for the purpose of storing and redirecting data for the
2016 Aquahacking event. This document gives a basic overview of different components of the portal and offer developers
basic instructions on how to manage and modify features in the portal.

## Module Overview

In a very high level, this application has three primary modules: Datasets, Toolkits, and Users.

### Users

Users is a pre-defined module
by MEAN.JS so you don't need to do a lot of changing to make sure that it is running smoothly. It is worth to mention user permissions
For Guest, they can only see the home page
For Signed-in users, they can only see and download the datasets
For admin, you can create, add, delete and update datasets.
As of now you need to change your account to admin manually in MongoDB database, in a collection called Users. The method you are
looking for is called FindOneAndUpdate, [Reference Here](https://docs.mongodb.com/v3.2/reference/method/db.collection.findOneAndUpdate/)


Few things to perhaps add:

* The "forgot password" feature did not work when I tested it locally, test it after deloyment to make sure it is functioning correctly
* CWA also requested a more comprehensive "Data Sharing Agreement" to be signed when user register. As of now I only put a phrase in that state the agreement,
check with CWA to make sure if the sharing-agreement as-is is okay or they need a pop-up and checkbox when user registers.
* Add ReCAPTHA to registration, to prevent bot traffic. [Tutorial](https://codeforgeek.com/2016/03/google-recaptcha-node-js-tutorial/)

### HomePage

Home page is already styled according to CWA standard, it is in the core folder of the project. You can find the styling at core.css. The only
thing to do:

* Modify the logo and favicon as CWA needs it.

### Datasets

Datasets have three views: the dataset list, the dataset view, and dataset creation view.

Things in general to do that still need finish:

* Update dataset with new files or delete existing files (maybe a dedicated dataset management interface)
* Delete dataset files when the dataset itself is deleted (completed, but bulk delete crashes the server)
* Some small UI bugs in the dataset creation page (sometimes error message does not show)
* Figure out a way to distinguish files with the same name.

####*Dataset List*

This is a list of datasets that are avaliable for the hack. I implemented an angular filter function on the left that searches and sort
data in real time. Reference list-datasets.client.controller.js and list-datasets.client-view.html for what I did specifically. Read
documentation[here](https://docs.angularjs.org/api/ng/filter/filter)for angular filter

This is the module where I did most of my work. The trick here is to implement some sort of data management structure where
files are being uploaded and stored in the backend server after users upload it. The way this is accomplished is to use a
AngularJS module called ng-file-upload in the front end and Node module called Multer in the back end to accomplish this task.

What I did was setting up an upload and download api using Multer in datasets.server.routes.js, and then use Angular routing to call the API in
datasets.client.controller.js. Remember that API calls in javascript is async, meaning that you need to do the variable assignment
in the callback.

Things to do here:

* For each dataset, for admin, add two buttons to remove and edit datasets
* Another that I haven't had time to figure out, is when filtering for category, I want to display a list of unique categories.
However, a dataset might have multiple categories, so we need a way to, in controller, look into each dataset and come up with a list
of unique categories. A workaround of the problem is to just manually define all the categories and not worry about it. Same apply for tags.


####*Dataset View*

This is the place where individual datasets are displayed. Nothing special here,
it is styled in a card-like fashion, with all information displayed. Things to do:

* Figure out a better way of styling the presentation of the files

####*Dataset Creation*

This is the place where datasets are created. The page links to the Angular front end for uploading. It is not perfect,
but functioning. Few things to do here:

####*Dataset Update*

This is the same as the dataset creation page, default of Yo generated modules. However, right now you can't update or delete files
already uploaded. You have to delete the entire dataset to do it. Few things to do:

* You can create an entirely new layout for the page, that offers a file management system. But conceptually it is pretty complex
since you need to interact with the File data model. You can choose to keep it as is since users won't be able to see it.

####Toolkit

This is the module that is newly constructed per request of CWA. The gist of the idea is that it can serve as a place for participants
to find tools available to them. The structure is similar to that of dataset, but much simplier (used Yo generator Module generation function)

Few things to do:

* Check with CWA to see whether the modules is to their satisfaction, haven't shown to them yet.
* Continue style and develop it as needed since I only created it the week I handed off to Cameron

##Deployment and Maintance

The project is version controlled and shared on Github. You can reach it at[here](https://github.com/su20yu1919/cwa-data-portal)

The project is currently undeployed, but deployment instruction on bluemix is included in MEAN.JS overview, which I will not expand further here.
We also have a contact at Bluemix, her name is Karolyn(kaschalk@us.ibm.com), Kipp(kbertke@us.ibm.com) is the project management contact, so CC him as well in all communications ()

There are two ways you can deploy this

1. Deploy everything on one server. This is very simple, but you might run into server loading problem if there are too many download requests. Proceed and load test with caution.
2. Use one server dedicated for storage (something like Amazon S3 equivalent of Bluemix), and then construct an upload and download api from there, and then  connect with API
with main portal. This is much more complex and will probably take you a week to do this alone (I can help to some degree to save time, but it means migration, change things, and you know, complex stuffs), but this is the industry standard way of doing this.

##Data Upload
First of all, reach out to Max to introduce yourself and get aquainted, he will be your point of contact at CWA. He is responsible
for reaching out to data owners with *SPECIFIC DATASE NEEDS* all you need is to load the dataset into portal.
There are three types of data files you can expect to get from data owners:

* csv, excel, any sort of flat files: those are the easiest to manage, just get them and directly upload them to the portal. Make sure to zip all the files to
reduce space needed. Most datasets will be in this format (hopefully).
* API connections to databases: If dataset owners have some sort of pre-established API documentation, just upload the documentation on
the portal with instructions of how to connect to APIs. Once again, not too difficult. Examples of this would be all data from IBM's PAIRS system and GLOS (Great Lakes Observatory System)
* No API connections to databases: at this point, either ask for a snapshot of the database, convert from whatever database they are in into
csv files, and upload onto the portal. Example of this will be dataset from the Poverty Center in Case. If this is not a possibility, just say no to uploading as it will take too long.

###*PAIRS*

PAIRS is the geographic storage system provided by IBM. I will get you in touch with Siyuan (lus@us.ibm.com), who is in charge of PAIRS. What you
need to do there is to create an account for AquaHack, and get credentials from PAIRS for the APIS, and then just ask them to be prepared for all the data
requests from users.

##Disclaimer and Assistance

Cameron, thank you so much for taking this over. This portal to be honest took a long time to figure out as I had no one's help
in what to do and basically googled and hard explored everything.

Due to my experience, don't want to leave you unassisted. Therefore, I offer my help in any capacity as you may need it.
I already figured most of the MEAN.JS api things out, but the process is pain stalking and very very time consuming. Please reach out to bill@humanlytics.co if you need any help. I also
promised Bryan I will advise you with the data curation process if you need my help on understanding different data infrastructures.

The long term goal is to make this hub the "Civic Insight Hub" Lev envisioned, but we are very far away still from the vision. Best luck!!

## Kauser's Technical Checklist

Hi Kauser, this segment is for you. Talking about high-level concerns and worries I might have about the hub during its usage,
and providing you with a checklist so you and Cam can better project manage.

In a user's perspective, the hub is complete with all features enabled, but in a developer's perspective there are still much to be done. I have sprinkled checklists across this documentation about what can be
improved about the hub, but since we are only one month away from the launch and Cam is only working on this part time, I would recommend pick two or three most important features that you would like to add to work on. This is
because each feature will take around 10 hours to develop, plus the time Cameron need to familiarize with all components of the hub and the nodejs framework, it is only viable to work on few of those.
You can even choose to not working on any features at all since in CWA's view the portal is already completed.

Overall, I would recommend paying attention to the following technical pitfalls:
* Server loading: I gave Cameron two deployment options. One very simple one difficult, the simple one can be done very quick, but have the potential of failing if too many people request download at the same time. So deploy and test early and leave at least a week for Cameron to change to the difficult method.
* Time management: Development is very time consuming. The construction of this site is fundamentally different than the
construction of the CMHA or Learning Studio site. Please give Cameron ample time to do everything. It is also kinda my mistake to
choose a more complex MEAN.JS bolierplate to start with, but in long-term this will benefit DigitalC greatly.

Things need from CWA to push the project forward:
* CWA need to give us a list  of data they need and topic of interest before we can do anything substaintial in terms of data loading. Period. They know this, but you
need to rush them to complete this step.
* CWA (Max specifically) is responsible for conducting the initial agenda setting and outreach to data owners, make it clear what they need, and then connect you/Cameron with the data owners to get the
data.
* You or Max need to interface with Stream 9 when their main site is complete to coordinate ways to link from the site they build to the portal, once its completed. Also you need to coordinate with
them to style the portal (but I have dont most of the styling already)
* In regards to data loading itself. Cameron need to create documentations for those data owners that does not have a complete documentation available. Once again, this takes more time.
* Final very small thing. Max keeps asking me for a data-sharing agreement, but I don't think he really know what it is and what it is for. Right now, by signing on the
site, users need to agree that they will use the data for the sole purpose of Aquahack and delete afterward. I think this is enough. Communicate with Bryan and Max to sort this out.
I am going to prepare something researched by Tamar to him for transition, but make sure that's what they need.

## MEAN.JS Overview

The portal is constructed on the MEAN.JS boilerplate, which has pre-constructed authentication and module structure. Please view MeanJS's
documentation [here](http://meanjs.org/docs.html) for detailed folder structure instruction. A basic introduction and additional resources are provided
in the section below

MEAN.JS is a full-stack JavaScript open-source solution, which provides a solid starting point for [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications. The idea is to solve the common issues with connecting those frameworks, build a robust framework to support daily development needs, and help developers use better practices while working with popular JavaScript components.

### Before You Begin
Before you begin we recommend you read about the basic building blocks that assemble a MEAN.JS application:
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS Guide](http://expressjs.com/guide/error-handling.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.


### Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
  * Node v5 IS NOT SUPPORTED AT THIS TIME! 
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```

* Sass - You're going to use [Sass](http://sass-lang.com/) to compile CSS during your grunt task. Make sure you have ruby installed, and then install Sass using gem install:

```bash
$ gem install sass
```

```bash
$ npm install -g grunt-cli
```

* Gulp - (Optional) You may use Gulp for Live Reload, Linting, and SASS or LESS.

```bash
$ npm install gulp -g
```

### Running Your Application
You'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.
If you encounter any problems, try the Troubleshooting section.

* explore `config/env/development.js` for development environment configuration options

### Running in Production mode
To run your application with *production* environment configuration, execute grunt as follows:

```bash
$ grunt prod
```

* explore `config/env/production.js` for production environment configuration options

### Running with User Seed
To have default account(s) seeded at runtime:

In Development:
```bash
MONGO_SEED=true grunt
```
It will try to seed the users 'user' and 'admin'. If one of the user already exists, it will display an error message on the console. Just grab the passwords from the console.

In Production:
```bash
MONGO_SEED=true grunt prod
```
This will seed the admin user one time if the user does not already exist. You have to copy the password from the console and save it.

### Running with TLS (SSL)
Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ sh ./scripts/generate-ssl-certs.sh
```

Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute grunt's prod task `grunt prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`


### Testing Your Application
You can run the full test suite included with MEAN.JS with the test task:

```bash
$ grunt test
```

This will run both the server-side tests (located in the app/tests/ directory) and the client-side tests (located in the public/modules/*/tests/).

To execute only the server tests, run the test:server task:

```bash
$ grunt test:server
```

And to run only the client tests, run the test:client task:

```bash
$ grunt test:client
```

### Running your application with Gulp

After the install process, you can easily run your project with:

```bash
$ gulp
```
or

```bash
$ gulp default
```

The server is now running on http://localhost:3000 if you are using the default settings. 

### Running Gulp Development Environment

Start the development environment with:

```bash
$ gulp dev
```

### Running in Production mode
To run your application with *production* environment configuration, execute gulp as follows:

```bash
$ gulp prod
```

### Testing Your Application with Gulp
Using the full test suite included with MEAN.JS with the test task:

### Run all tests
```bash
$ gulp test
```

### Run server tests
```bash
gulp test:server
```

### Run client tests
```bash
gulp test:client
```

### Run e2e tests
```bash
gulp test:e2e
```

## Development and deployment With Docker

* Install [Docker](https://docs.docker.com/installation/#installation)
* Install [Compose](https://docs.docker.com/compose/install/)

* Local development and testing with compose:
```bash
$ docker-compose up
```

* Local development and testing with just Docker:
```bash
$ docker build -t mean .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean
$
```

* To enable live reload, forward port 35729 and mount /app and /public as volumes:
```bash
$ docker run -p 3000:3000 -p 35729:35729 -v /Users/mdl/workspace/mean-stack/mean/public:/home/mean/public -v /Users/mdl/workspace/mean-stack/mean/app:/home/mean/app --link db:db_1 mean
```
### Deploying To Cloud Foundry

Cloud Foundry is an open source platform-as-a-service (PaaS).  The MEANJS project
can easily be deployed to any Cloud Foundry instance.  The easiest way to deploy the
MEANJS project to Cloud Foundry is to use a public hosted instance.  The two most popular
instances are [Pivotal Web Services](https://run.pivotal.io/) and
[IBM Bluemix](https://bluemix.net).  Both provide free trials and support pay-as-you-go models
for hosting applications in the cloud.  After you have an account follow the below steps to deploy MEANJS.

* Install the [Cloud Foundry command line tools](http://docs.cloudfoundry.org/devguide/installcf/install-go-cli.html).
* Now you need to log into Cloud Foundry from the Cloud Foundry command line.
  *  If you are using Pivotal Web Services run `$ cf login -a api.run.pivotal.io`.
  *  If you are using IBM Bluemix run `$ cf login -a api.ng.bluemix.net`.
* Create a Mongo DB service.
+  *  If you are using Pivotal Web Services run `$ cf create-service mongolab sandbox mean-mongo`
+  *  If you are using IBM Bluemix run `$ cf create-service mongodb 100 mean-mongo`
* Clone the GitHub repo for MEANJS if you have not already done so
  * `$ git clone https://github.com/meanjs/mean.git && cd mean`
* Run `$ npm install`
* Run the Grunt Build task to build the optimized JavaScript and CSS files
  * `$ grunt build`
* Deploy MEANJS to Cloud Foundry
  * `$ cf push`

After `cf push` completes you will see the URL to your running MEANJS application 
(your URL will be different).

    requested state: started
    instances: 1/1
    usage: 128M x 1 instances
    urls: mean-humbler-frappa.mybluemix.net

Open your browser and go to that URL and your should see your MEANJS app running!

###  Deploying MEANJS To IBM Bluemix
IBM Bluemix is a Cloud Foundry based PaaS.  By clicking the button below you can signup for Bluemix and deploy
a working copy of this application to the cloud without having to do the steps above.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https%3A%2F%2Fgithub.com%2Fsu20yu1919%2Fcwa-portal)

After the deployment is finished you will be left with a copy of the MEANJS code in your own private Git repo
in Bluemix complete with a pre-configured build and deploy pipeline.  Just clone the Git repo, make your changes, and
commit them back.  Once your changes are committed, the build and deploy pipeline will run automatically deploying
your changes to Bluemix.

