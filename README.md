# Pairing Scheduler

This app schedules pairs of developers across a project's sprints. it is built with Rails API and React via `create-react-app`. The UI leverages [Grommet](https://v2.grommet.io/).


## Assumptions

- Each sprint has a duration of 1 week.
- Each sprint starts on Monday and ends on Friday (there are no partial sprints).
- No developer is taking any paid time off during the course of the project.
- 
## Acceptance Criteria

- The user can view the pair rotation schedule.
- Each developer pairs with every other developer an equal number of times during the project, or as close to equal as possible.
- During any given sprint, at most 1 developer is soloing.
- The sprint schedule data is persisted.


## Run the app

`.rubyversion` should catch this requirement but in case not, this was built with `ruby '2.7.0'`, so first get ruby 2.7.0 if not yet on your machine.


From the root of the project...


### Install the required packages/dependencies

```
bundle
yarn install
```



### Setup your DB and seed a little data

```
rails db:create db:migrate db:seed
```


### Start the development server

There is a `Procfile` to run everything easily, but you need to get [`foreman` locally if you don't already have](https://github.com/ddollar/foreman/wiki/Don't-Bundle-Foreman)

```
gem install foreman
foreman start -f ./Procfile.dev
```



If you really don't want to install `foreman` locally, you can open two terminals....still in the root in the project:

in one:

```
rails s --port 5000
```

and in the other:

```
yarn dev
```



Depending on whether you ran your servers via the `Procile` (recommended) or not, choose the appropriate path to view the app in your browser:

- running with foreman http://localhost:5100/
- running in separate terminals: http://localhost:3000/ (default `create-react-app` port)

## View the seeded data and create some projects!

**seeds**: THe seeded data should have created a single project with 5 developers and 4 sprints. You can view that by clicking on the project in the menu list.

Schedule new projects by entering the number of sprints, selecting engineers, and clicking the calendar to select a start date (only valid dates should be enaled.)

The devs created for the seed data are available for your new projects. To create new developers, just enter their unique name in the form field and click enter. The new developer will be created when with the project.
