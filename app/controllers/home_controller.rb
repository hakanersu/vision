class HomeController < ApplicationController
     def index; end
     def about
       render inertia: "About"
     end

     def contact
        render inertia: "Contact"
     end
end
