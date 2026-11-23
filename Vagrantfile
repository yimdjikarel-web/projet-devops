
Vagrant.configure("2") do |config|

  config.vm.box = "bento/ubuntu-24.04"

  config.vm.hostname = "devops-server"

  # Redirection des ports entre Windows et Ubuntu
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 9090, host: 9090
  config.vm.network "forwarded_port", guest: 3001, host: 3001

  config.vm.provider "virtualbox" do |vb|
    vb.name = "DevOps-Server"
    vb.memory = 4096
    vb.cpus = 2
  end

end
