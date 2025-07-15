CREATE TABLE `camaras` (
  `id_camara` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ip` varchar(100) NOT NULL,
  `usuario_rtsp` varchar(100) DEFAULT NULL,
  `contrasena_rtsp` varchar(100) DEFAULT NULL,
  `id_creador` int(11) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `comuna` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `es_particular` tinyint(1) DEFAULT 1
);

CREATE TABLE `empresas` (
  `id_empresa` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `rut` varchar(20) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL
);

CREATE TABLE `logs` (
  `id_log` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_camara` int(11) DEFAULT NULL,
  `evento` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp()
);

CREATE TABLE `permisos` (
  `id_usuario` int(11) NOT NULL,
  `id_camara` int(11) NOT NULL
);

CREATE TABLE `respuestas_ticket` (
  `id_respuesta` int(11) NOT NULL,
  `id_ticket` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha` datetime DEFAULT current_timestamp()
);

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
);

CREATE TABLE `tickets_soporte` (
  `id_ticket` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `estado` enum('Abierto','En Proceso','Cerrado') DEFAULT 'Abierto',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_cierre` datetime DEFAULT NULL
);

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL
);

INSERT INTO `camaras` (`id_camara`, `nombre`, `ip`, `usuario_rtsp`, `contrasena_rtsp`, `id_creador`, `region`, `comuna`, `direccion`, `id_empresa`, `es_particular`) VALUES
(7, 'Cámara funcional', '172.16.1.164', 'admin', 'Admin123', 1, 'Metropolitana', 'Santiago', 'Av. Siempre Viva 123', NULL, 1),
(14, 'Camara Prueba', '172.16.1.160', 'admin', 'Admin123', 1, 'Valparaiso', 'La Calera', 'Av Centenario 100', NULL, 1),
(15, 'Entrada', '172.16.1.50', 'admin', 'Adm@285138', 1, 'Nose', 'Nose', 'Nose', NULL, 1);

INSERT INTO `empresas` (`id_empresa`, `nombre`, `rut`, `direccion`) VALUES
(4, 'Empresa Prueba 1', '2-9', 'Santiago');

INSERT INTO `logs` (`id_log`, `id_usuario`, `id_camara`, `evento`, `fecha`) VALUES
(1, 1, NULL, 'Inicio de sesión', '2025-07-10 16:33:18');

INSERT INTO `permisos` (`id_usuario`, `id_camara`) VALUES
(17, 7);

INSERT INTO `respuestas_ticket` (`id_respuesta`, `id_ticket`, `id_usuario`, `mensaje`, `fecha`) VALUES
(1, 2, 1, 'no se puede ', '2025-07-11 16:04:58');

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'Admin'),
(2, 'Intermedio'),
(3, 'Usuario');

INSERT INTO `tickets_soporte` (`id_ticket`, `id_usuario`, `asunto`, `descripcion`, `estado`, `fecha_creacion`, `fecha_cierre`) VALUES
(1, 17, 'No puedo ver la cámara', 'Al acceder a la cámara del patio, la pantalla queda en negro.', 'Cerrado', '2025-07-11 15:36:09', '2025-07-11 16:06:37'),
(2, 17, 'sss', 'sssss', 'Abierto', '2025-07-11 15:36:27', NULL),
(3, 17, 'hola', 'como estas', 'Abierto', '2025-07-11 16:05:41', NULL);

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contrasena`, `id_rol`) VALUES
(1, 'Administrador', 'admin@admin.com', '$2a$10$vXYLxIPbzGiuEaNHxaoTpO2pYkPz7h01T1a.GfgwxSjmmZ6cnBUxm', 1);

ALTER TABLE `camaras`
  ADD PRIMARY KEY (`id_camara`),
  ADD KEY `id_creador` (`id_creador`),
  ADD KEY `id_empresa` (`id_empresa`);

ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id_empresa`),
  ADD UNIQUE KEY `rut` (`rut`);

ALTER TABLE `logs`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_camara` (`id_camara`);

ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id_usuario`,`id_camara`),
  ADD KEY `id_camara` (`id_camara`);

ALTER TABLE `respuestas_ticket`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `id_ticket` (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`);

ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

ALTER TABLE `tickets_soporte`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `id_rol` (`id_rol`);

ALTER TABLE `camaras`
  MODIFY `id_camara` int(11) NOT NULL AUTO_INCREMENT,;

ALTER TABLE `empresas`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT,;

ALTER TABLE `logs`
  MODIFY `id_log` int(11) NOT NULL AUTO_INCREMENT,;

ALTER TABLE `respuestas_ticket`
  MODIFY `id_respuesta` int(11) NOT NULL AUTO_INCREMENT,;

ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT,;

ALTER TABLE `tickets_soporte`
  MODIFY `id_ticket` int(11) NOT NULL AUTO_INCREMENT,;

ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT,;

ALTER TABLE `camaras`
  ADD CONSTRAINT `camaras_ibfk_1` FOREIGN KEY (`id_creador`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `camaras_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`);

ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `logs_ibfk_2` FOREIGN KEY (`id_camara`) REFERENCES `camaras` (`id_camara`);

ALTER TABLE `permisos`
  ADD CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `permisos_ibfk_2` FOREIGN KEY (`id_camara`) REFERENCES `camaras` (`id_camara`);

ALTER TABLE `respuestas_ticket`
  ADD CONSTRAINT `respuestas_ticket_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `tickets_soporte` (`id_ticket`),
  ADD CONSTRAINT `respuestas_ticket_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `tickets_soporte`
  ADD CONSTRAINT `tickets_soporte_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);

END$$

CREATE PROCEDURE `sp_actualizar_empresa` (IN `p_id` INT, IN `p_nombre` VARCHAR(100), IN `p_rut` VARCHAR(20), IN `p_direccion` VARCHAR(200))   BEGIN
  UPDATE empresas
  SET nombre = p_nombre,
      rut = p_rut,
      direccion = p_direccion
  WHERE id_empresa = p_id;

END$$

CREATE PROCEDURE `sp_actualizar_usuario` (IN `p_id` INT, IN `p_nombre` VARCHAR(100), IN `p_correo` VARCHAR(100), IN `p_id_rol` INT)   BEGIN
  UPDATE usuarios
  SET nombre = p_nombre,
      correo = p_correo,
      id_rol = p_id_rol
  WHERE id_usuario = p_id;

END$$

CREATE PROCEDURE `sp_asignar_permiso` (IN `p_id_usuario` INT, IN `p_id_camara` INT)   BEGIN
  INSERT IGNORE INTO permisos (id_usuario, id_camara)
  VALUES (p_id_usuario, p_id_camara);

END$$

CREATE PROCEDURE `sp_cambiar_estado_ticket` (IN `p_id_ticket` INT, IN `p_nuevo_estado` ENUM('Abierto','En Proceso','Cerrado'))   BEGIN
  UPDATE tickets_soporte
  SET estado = p_nuevo_estado,
      fecha_cierre = IF(p_nuevo_estado = 'Cerrado', CURRENT_TIMESTAMP, NULL)
  WHERE id_ticket = p_id_ticket;

END$$

CREATE PROCEDURE `sp_crear_camara` (IN `p_nombre` VARCHAR(100), IN `p_ip` VARCHAR(100), IN `p_usuario` VARCHAR(100), IN `p_contrasena` VARCHAR(100), IN `p_id_creador` INT, IN `p_region` VARCHAR(100), IN `p_comuna` VARCHAR(100), IN `p_direccion` VARCHAR(200), IN `p_id_empresa` INT, IN `p_es_particular` BOOLEAN)   BEGIN
  INSERT INTO camaras (
    nombre, ip, usuario_rtsp, contrasena_rtsp, id_creador,
    region, comuna, direccion, id_empresa, es_particular
  )
  VALUES (
    p_nombre, p_ip, p_usuario, p_contrasena, p_id_creador,
    p_region, p_comuna, p_direccion, p_id_empresa, p_es_particular
  );

END$$

CREATE PROCEDURE `sp_crear_empresa` (IN `p_nombre` VARCHAR(100), IN `p_rut` VARCHAR(20), IN `p_direccion` VARCHAR(200))   BEGIN
  INSERT INTO empresas (nombre, rut, direccion)
  VALUES (p_nombre, p_rut, p_direccion);

END$$

CREATE PROCEDURE `sp_crear_ticket` (IN `p_id_usuario` INT, IN `p_asunto` VARCHAR(255), IN `p_descripcion` TEXT)   BEGIN
  INSERT INTO tickets_soporte (id_usuario, asunto, descripcion)
  VALUES (p_id_usuario, p_asunto, p_descripcion);

END$$

CREATE PROCEDURE `sp_crear_usuario` (IN `p_nombre` VARCHAR(100), IN `p_correo` VARCHAR(100), IN `p_contrasena` VARCHAR(255), IN `p_id_rol` INT)   BEGIN
  INSERT INTO usuarios (nombre, correo, contrasena, id_rol)
  VALUES (p_nombre, p_correo, p_contrasena, p_id_rol);

END$$

CREATE PROCEDURE `sp_eliminar_camara` (IN `p_id` INT)   BEGIN
  -- Elimina los permisos primero
  DELETE FROM permisos WHERE id_camara = p_id;

END$$

CREATE PROCEDURE `sp_eliminar_empresa` (IN `p_id` INT)   BEGIN
  DELETE FROM empresas WHERE id_empresa = p_id;

END$$

CREATE PROCEDURE `sp_eliminar_usuario` (IN `p_id` INT)   BEGIN
  -- Eliminar todos los permisos del usuario
  DELETE FROM permisos WHERE id_usuario = p_id;

END$$

CREATE PROCEDURE `sp_listar_camaras_admin` ()   BEGIN
  SELECT * FROM camaras;

END$$

CREATE PROCEDURE `sp_listar_camaras_particulares` ()   BEGIN
  SELECT *
  FROM camaras
  WHERE es_particular = TRUE AND id_empresa IS NULL;

END$$

CREATE PROCEDURE `sp_listar_camaras_permitidas` (IN `p_id_usuario` INT)   BEGIN
  SELECT c.*
  FROM camaras c
  INNER JOIN permisos p ON c.id_camara = p.id_camara
  WHERE p.id_usuario = p_id_usuario;

END$$

CREATE PROCEDURE `sp_listar_camaras_por_empresa` (IN `p_id_empresa` INT)   BEGIN
  SELECT *
  FROM camaras
  WHERE id_empresa = p_id_empresa;

END$$

CREATE PROCEDURE `sp_listar_camaras_por_usuario` (IN `p_id_usuario` INT)   BEGIN
  SELECT * FROM camaras WHERE id_creador = p_id_usuario;

END$$

CREATE PROCEDURE `sp_listar_empresas` ()   BEGIN
  SELECT * FROM empresas;

END$$

CREATE PROCEDURE `sp_listar_logs` ()   BEGIN
  SELECT l.id_log, u.nombre AS usuario, c.nombre AS camara, l.fecha
  FROM logs l
  INNER JOIN usuarios u ON l.id_usuario = u.id_usuario
  INNER JOIN camaras c ON l.id_camara = c.id_camara
  ORDER BY l.fecha DESC;

END$$

CREATE PROCEDURE `sp_listar_respuestas_ticket` (IN `p_id_ticket` INT)   BEGIN
  SELECT r.id_respuesta, u.nombre AS autor, r.mensaje, r.fecha
  FROM respuestas_ticket r
  JOIN usuarios u ON r.id_usuario = u.id_usuario
  WHERE r.id_ticket = p_id_ticket
  ORDER BY r.fecha ASC;

END$$

CREATE PROCEDURE `sp_listar_tickets_admin` ()   BEGIN
  SELECT t.id_ticket, t.asunto, t.estado, t.fecha_creacion, u.nombre AS creado_por
  FROM tickets_soporte t
  JOIN usuarios u ON t.id_usuario = u.id_usuario
  ORDER BY t.fecha_creacion DESC;

END$$

CREATE PROCEDURE `sp_listar_tickets_por_usuario` (IN `p_id_usuario` INT)   BEGIN
  SELECT id_ticket, asunto, estado, fecha_creacion, fecha_cierre
  FROM tickets_soporte
  WHERE id_usuario = p_id_usuario
  ORDER BY fecha_creacion DESC;

END$$

CREATE PROCEDURE `sp_listar_usuarios` ()   BEGIN
  SELECT u.id_usuario, u.nombre, u.correo, r.nombre AS rol
  FROM usuarios u
  INNER JOIN roles r ON u.id_rol = r.id_rol;

END$$

CREATE PROCEDURE `sp_obtener_camara` (IN `p_id` INT)   BEGIN
  SELECT * FROM camaras WHERE id_camara = p_id;

END$$

CREATE PROCEDURE `sp_obtener_empresa` (IN `p_id` INT)   BEGIN
  SELECT * FROM empresas WHERE id_empresa = p_id;

END$$

CREATE PROCEDURE `sp_obtener_logs_por_camara` (IN `p_id_camara` INT)   BEGIN
  SELECT * FROM logs
  WHERE id_camara = p_id_camara
  ORDER BY fecha DESC;

END$$

CREATE PROCEDURE `sp_obtener_logs_por_usuario` (IN `p_id_usuario` INT)   BEGIN
  SELECT * FROM logs
  WHERE id_usuario = p_id_usuario
  ORDER BY fecha DESC;

END$$

CREATE PROCEDURE `sp_obtener_todos_los_logs` ()   BEGIN
  SELECT * FROM logs ORDER BY fecha DESC;

END$$

CREATE PROCEDURE `sp_obtener_usuario_por_correo` (IN `p_correo` VARCHAR(100))   BEGIN
  SELECT * FROM usuarios WHERE correo = p_correo;

END$$

CREATE PROCEDURE `sp_obtener_usuario_por_id` (IN `p_id` INT)   BEGIN
  SELECT u.id_usuario, u.nombre, u.correo, u.id_rol
  FROM usuarios u
  WHERE u.id_usuario = p_id;

END$$

CREATE PROCEDURE `sp_quitar_permiso` (IN `p_id_usuario` INT, IN `p_id_camara` INT)   BEGIN
  DELETE FROM permisos
  WHERE id_usuario = p_id_usuario AND id_camara = p_id_camara;

END$$

CREATE PROCEDURE `sp_registrar_log` (IN `p_id_usuario` INT, IN `p_id_camara` INT, IN `p_evento` VARCHAR(255))   BEGIN
  INSERT INTO logs (id_usuario, id_camara, evento)
  VALUES (p_id_usuario, p_id_camara, p_evento);

END$$

CREATE PROCEDURE `sp_responder_ticket` (IN `p_id_ticket` INT, IN `p_id_usuario` INT, IN `p_mensaje` TEXT)   BEGIN
  INSERT INTO respuestas_ticket (id_ticket, id_usuario, mensaje)
  VALUES (p_id_ticket, p_id_usuario, p_mensaje);