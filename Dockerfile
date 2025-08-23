# pull official base image
FROM node:16.13-alpine

# set working directory
WORKDIR /app
EXPOSE 3001 3001
# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH




# install app dependencies
COPY package.json ./
RUN npm install
RUN npm install -g serve
#COPY package-lock.json ./

# RUN npm install 
# RUN npm install react-scripts@3.4.1 -g 

# add app
COPY . ./
RUN npm run build


# start app
CMD ["serve",  "-s", "build"]
